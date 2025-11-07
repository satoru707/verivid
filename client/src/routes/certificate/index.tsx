import { createFileRoute } from "@tanstack/react-router"
import { CertificatePage } from "../../components/pages/CertificatePage"

export const Route = createFileRoute("/certificate/")({
  component: CertificatePage,
})
