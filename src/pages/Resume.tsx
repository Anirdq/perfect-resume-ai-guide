
import GlassNavbar from "@/components/GlassNavbar";
import Index from "./Index";

// This just reuses the Index resume optimization UI, but you can extend/change as needed.
const Resume = () => (
  <div className="min-h-screen bg-gray-50">
    <GlassNavbar />
    <div className="pt-24">
      <Index />
    </div>
  </div>
);
export default Resume;
