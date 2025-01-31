import PanelLayout from "../layout"

export default function QrCodePage() {
  return (
    <div>
      QR-code
    </div>
  )
}

QrCodePage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>