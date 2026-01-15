"use client";

import DeviceInfoView from "@/views/Settings/DeviceInfoView";
import { useRouter } from "next/navigation";

export default function DeviceInfoPage() {
    const router = useRouter();
    return <DeviceInfoView onBack={() => router.back()} />;
}
