import { useState, useEffect, useRef } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./App.css";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useConfirm } from "material-ui-confirm";
import { saveAs } from "file-saver";
import {
  convertTimestamp,
  getFileType,
  getExportFileType,
  binaryStringToArrayBuffer,
} from "./utils";
import { DRIVE_SCOPE } from "./constants";
import { SignInButton } from "./SignInButton";
import { LogOutFooter } from "./LogOutFooter";
import { Toolbar } from "./Toolbar";

// Column definitions for AG Grid, fields and their headers
const colDefs = [
  { field: "fileName", headerName: "Name", minWidth: 300 },
  {
    field: "lastModified",
    headerName: "Last modified",
    minWidth: 200,
    comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
      const timeA = new Date(valueA).getTime();
      const timeB = new Date(valueB).getTime();
      if (timeA === timeB) return 0;
      return timeA > timeB ? 1 : -1;
    },
  },
  { field: "fileType", headerName: "File Type" },
];

function App() {
  // State management
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [fileRows, setFileRows] = useState([]);
  const [rowsSelected, setRowsSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoadingRows, setLoadingRows] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const confirm = useConfirm(); //  for showing confirmation dialogs

  async function listFiles(pageToken) {
    let response;
    try {
      // Call Google Drive API to list files
      response = await gapi.client.drive.files.list({
        pageToken,
        q: "trashed=false and mimeType != 'application/vnd.google-apps.folder'", // Files inside folders, not in trash
        fields: "nextPageToken, files(id, name, modifiedTime, mimeType)",
      });
      const { nextPageToken, files } = response.result;
      const fileRows = files.map((file) => {
        return {
          id: file.id,
          fileName: file.name,
          lastModified: convertTimestamp(file.modifiedTime),
          fileType: getFileType(file.mimeType),
          mimeType: file.mimeType,
        };
      });

      // Update state with new file rows
      setFileRows((prevRows) => [...prevRows, ...fileRows]);

      // Recursively load more files for each page
      if (nextPageToken) {
        await listFiles(nextPageToken);
      } else {
        setLoadingRows(false);
      }
    } catch (err) {
      console.error(err);
      return;
    }
  }

  // Delete a file by moving it to the trash
  async function deleteFile(fileId) {
    try {
      await gapi.client.drive.files.update({
        fileId: fileId,
        resource: { trashed: true },
      });
      console.log(`File ${fileId} moved to trash successfully.`);
    } catch (error) {
      console.error("Error moving file to trash:", error.message);
    }
  }

  // Handle deletion of selected files
  function handleDelete() {
    confirm({ description: `This will move the selected files to the trash.` })
      .then(async () => {
        for (const selectedFile of selectedRows) {
          deleteFile(selectedFile.id);
        }
        const selectedRowIds = selectedRows.map((row) => row.id);

        setFileRows((prevRows) =>
          prevRows.filter((row) => !selectedRowIds.includes(row.id))
        );

        setSnackbarMsg("Files moved to trash");
        setSnackbarOpen(true);
      })
      .catch(() => console.log("Deletion cancelled."));
  }

  // Close the Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  //  Handle downloading selected files
  async function handleDownload() {
    for (const selectedFile of selectedRows) {
      const { id: fileId, fileName, fileType, mimeType } = selectedFile;

      // Check for unsupported types
      if (
        mimeType === "application/vnd.google-apps.map" ||
        mimeType === "application/vnd.google-apps.site"
      ) {
        console.error("Download not supported for file type: ", mimeType);
        setSnackbarMsg(`Download not supported for file type: ${fileType}`);
        setSnackbarOpen(true);
        continue;
      }

      try {
        let response;

        if (mimeType.startsWith("application/vnd.google-apps")) {
          // Use export for Google Docs types
          response = await gapi.client.drive.files.export({
            fileId,
            mimeType: getExportFileType(mimeType),
          });
        } else {
          response = await gapi.client.drive.files.get({
            fileId,
            alt: "media",
          });
        }

        // Convert binary to Blob and download
        const arrayBuf = binaryStringToArrayBuffer(response.body);
        const blob = new Blob([arrayBuf], {
          type: response.headers["Content-Type"],
        });

        saveAs(blob, fileName);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    }
  }

  // Handle uploading a file to Google Drive
  async function handleUpload(event) {
    try {
      const file = event.target.files[0];
      const metadata = {
        name: file.name,
        mimeType: file.mimeType,
        parents: ["root"], // Google Drive folder id
      };
      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      form.append("file", file);

      // Call Google Drive APi to upload the file
      axios
        .post(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true",
          form,
          {
            headers: {
              Authorization: "Bearer " + user.access_token,
              "Content-Type": "multipart/form-data", // Ensure content type is set
            },
          }
        )
        .then((response) => {
          const { id, name, mimeType } = response.data;

          // Update state with the new file
          const newFileRow = {
            id,
            fileName: name,
            lastModified: convertTimestamp(new Date()),
            fileType: getFileType(mimeType),
            mimeType,
          };
          setFileRows((prevRows) => [newFileRow, ...prevRows]);
          setSnackbarMsg(`Uploaded file ${name}`);
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  // Login with OAuth2
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.error("Login Failed:", error),
    scope: DRIVE_SCOPE,
  });

  // Handle user login and file loading
  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then(async (res) => {
          setProfile(res.data);
          await listFiles();
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  // Logout and reset
  const logOut = () => {
    googleLogout();
    setUser(null);
    setProfile(null);
    setFileRows([]);
    setLoadingRows(true);
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        padding: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {profile ? (
        isLoadingRows ? (
          <>
            {/* Loading */}
            {fileRows.length ? (
              <h2>Loading files… ({fileRows.length})</h2>
            ) : (
              <h2>Loading files…</h2>
            )}
            <Box sx={{ width: "50%" }}>
              <LinearProgress />
            </Box>
          </>
        ) : (
          <div
            style={{ width: "50%", height: "520px" }}
            className={"ag-theme-quartz-dark"}
            data-testid="ag-grid"
          >
            {/* Toolbar & Data Grid */}
            <Toolbar
              onChangeFileUpload={handleUpload}
              onClickDownload={handleDownload}
              downloadBtnDisabled={!rowsSelected}
              onClickDelete={handleDelete}
              deleteBtnDisabled={!rowsSelected}
            />
            <AgGridReact
              rowData={fileRows}
              columnDefs={colDefs}
              rowSelection="multiple"
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 25, 50]}
              onSelectionChanged={(event) => {
                const selectedRows = event.api.getSelectedRows();
                setRowsSelected(selectedRows.length > 0);
                setSelectedRows(selectedRows);
              }}
              autoSizeStrategy={{ type: "fitGridWidth" }}
            />
            {/* Log out */}
            <LogOutFooter onClick={logOut} />
          </div>
        )
      ) : (
        <>
          {/* Sign in */}
          <SignInButton onClick={login} />
        </>
      )}
      {/* Shows messages at bottom left */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMsg}
      />
    </div>
  );
}

export default App;
