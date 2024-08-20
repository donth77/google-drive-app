import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { Toolbar } from "../src/Toolbar";

describe("Toolbar", () => {
  it("renders all buttons", () => {
    render(
      <Toolbar
        onChangeFileUpload={vi.fn()}
        onClickDownload={vi.fn()}
        downloadBtnDisabled={false}
        onClickDelete={vi.fn()}
        deleteBtnDisabled={false}
      />
    );

    const uploadButton = screen.getByTestId("upload-btn");
    const downloadButton = screen.getByTestId("download-btn");
    const deleteButton = screen.getByTestId("delete-btn");

    expect(uploadButton).toBeInTheDocument();
    expect(downloadButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it("triggers onChangeFileUpload when file is uploaded", () => {
    const handleFileUpload = vi.fn();
    render(
      <Toolbar
        onChangeFileUpload={handleFileUpload}
        onClickDownload={vi.fn()}
        downloadBtnDisabled={false}
        onClickDelete={vi.fn()}
        deleteBtnDisabled={false}
      />
    );

    const uploadButton = screen.getByTestId("upload-btn");
    fireEvent.click(uploadButton);

    const fileInput = screen.getByTestId("upload-input");
    fireEvent.change(fileInput, {
      target: {
        files: [new File(["file"], "file.txt", { type: "text/plain" })],
      },
    });

    expect(handleFileUpload).toHaveBeenCalledTimes(1);
  });

  it("triggers onClickDownload when download button is clicked", () => {
    const handleDownloadClick = vi.fn();
    render(
      <Toolbar
        onChangeFileUpload={vi.fn()}
        onClickDownload={handleDownloadClick}
        downloadBtnDisabled={false}
        onClickDelete={vi.fn()}
        deleteBtnDisabled={false}
      />
    );

    const downloadButton = screen.getByTestId("download-btn");
    fireEvent.click(downloadButton);

    expect(handleDownloadClick).toHaveBeenCalledTimes(1);
  });

  it("triggers onClickDelete when delete button is clicked", () => {
    const handleDeleteClick = vi.fn();
    render(
      <Toolbar
        onChangeFileUpload={vi.fn()}
        onClickDownload={vi.fn()}
        downloadBtnDisabled={false}
        onClickDelete={handleDeleteClick}
        deleteBtnDisabled={false}
      />
    );

    const deleteButton = screen.getByTestId("delete-btn");
    fireEvent.click(deleteButton);

    expect(handleDeleteClick).toHaveBeenCalledTimes(1);
  });

  it("disables download button when downloadBtnDisabled is true", () => {
    render(
      <Toolbar
        onChangeFileUpload={vi.fn()}
        onClickDownload={vi.fn()}
        downloadBtnDisabled={true}
        onClickDelete={vi.fn()}
        deleteBtnDisabled={false}
      />
    );

    const downloadButton = screen.getByTestId("download-btn");
    expect(downloadButton).toBeDisabled();
  });

  it("disables delete button when deleteBtnDisabled is true", () => {
    render(
      <Toolbar
        onChangeFileUpload={vi.fn()}
        onClickDownload={vi.fn()}
        downloadBtnDisabled={false}
        onClickDelete={vi.fn()}
        deleteBtnDisabled={true}
      />
    );

    const deleteButton = screen.getByTestId("delete-btn");
    expect(deleteButton).toBeDisabled();
  });
});
