import { Button } from "react-bootstrap";

// This component is used to export a CSV file

type FileExportProps = {
  contentName: String;
};

export function FileExport({ contentName }: FileExportProps) {
  const exportCSV = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:30001/admin/export/${contentName}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export CSV file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${contentName}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  return (
    <Button variant="success" onClick={exportCSV}>
      Export CSV File
    </Button>
  );
}
