import { ImageResponse } from "next/og";
import { join } from "path";
import { readFileSync } from "fs";

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = "image/jpeg";

// Image generation
export default function Icon() {
    // Read the source image from public directory
    const filePath = join(process.cwd(), "public", "favicon_website.jpg");
    const fileBuffer = readFileSync(filePath);
    const imageSrc = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: "50%", // This creates the circular shape
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageSrc}
                    alt="Favicon"
                    width="32"
                    height="32"
                    style={{
                        objectFit: "cover",
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    );
}
