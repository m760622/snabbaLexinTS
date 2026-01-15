"use client";

import ChangelogView from "@/views/Settings/ChangelogView";
import { useRouter } from "next/navigation";

export default function ChangelogPage() {
    const router = useRouter();
    return <ChangelogView onBack={() => router.back()} />;
}
