"use client";

import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

function ExportButton(): React.ReactElement {
  const handleExport = (): void => {
    showToast("Fitur premium — segera hadir! 🚀", "info");
  };

  return (
    <Button variant="outline" size="md" fullWidth onClick={handleExport}>
      <Download size={16} strokeWidth={3} />
      Export CSV
    </Button>
  );
}

export { ExportButton };
