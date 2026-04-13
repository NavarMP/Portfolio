"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Loader2 } from "lucide-react";

interface ArchiveButtonProps {
    id: string;
    isArchived: boolean;
}

export default function ArchiveButton({ id, isArchived }: ArchiveButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleArchiveToggle = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isArchived: !isArchived }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                console.error("Failed to toggle archive status");
                alert("Failed to update archive status");
            }
        } catch (error) {
            console.error("Error toggling archieve status:", error);
            alert("Error updating archive status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleArchiveToggle}
            disabled={loading}
            className={`p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isArchived 
                    ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white"
                    : "bg-surface-variant/30 text-on-surface hover:bg-amber-500 hover:text-white"
            }`}
            title={isArchived ? "Unarchive Project" : "Archive Project"}
        >
            {loading ? (
                <Loader2 size={20} className="animate-spin" />
            ) : isArchived ? (
                <ArchiveRestore size={20} />
            ) : (
                <Archive size={20} />
            )}
        </button>
    );
}
