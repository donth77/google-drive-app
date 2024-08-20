import { useRef } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";

export function Toolbar({
  onChangeFileUpload,
  onClickDownload,
  downloadBtnDisabled,
  onClickDelete,
  deleteBtnDisabled,
}) {
  const hiddenFileInput = useRef(null);

  function handleUploadClick() {
    hiddenFileInput.current.click();
  }
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        margin: "0 0 6px 0",
        gap: "16px",
      }}
    >
      <input
        data-testid="upload-input"
        ref={hiddenFileInput}
        type="file"
        onChange={onChangeFileUpload}
        style={{ display: "none" }}
      />
      <button data-testid="upload-btn" onClick={handleUploadClick}>
        <FileUploadIcon />
      </button>
      <button
        data-testid="download-btn"
        disabled={downloadBtnDisabled}
        onClick={onClickDownload}
      >
        <DownloadIcon />
      </button>
      <button
        data-testid="delete-btn"
        disabled={deleteBtnDisabled}
        onClick={onClickDelete}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}
