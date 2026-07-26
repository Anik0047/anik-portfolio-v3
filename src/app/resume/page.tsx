import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
	title: "Resume",
	alternates: {
		canonical: `${siteUrl}/resume`,
	},
};

export default function Resume() {
	return (
    <iframe
      title='Anik Barua Resume'
      src='/Anik_Barua_Resume.pdf'
      width='100%'
      height='100%'
      style={{ minHeight: '100vh' }}
    />
  );
}
