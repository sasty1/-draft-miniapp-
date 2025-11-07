"use client";
import { useState, useEffect } from "react";

interface Draft {
  id: number;
  content: string;
  imageUrl?: string;
  scheduledTime?: string;
  status: "Draft" | "Scheduled" | "Posted" | "Failed";
}

export default function Home() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("drafts");
    if (saved) setDrafts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("drafts", JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    const interval = setInterval(() => {
      drafts.forEach(async (draft) => {
        if (
          draft.scheduledTime &&
          draft.status === "Scheduled" &&
          new Date(draft.scheduledTime) <= new Date()
        ) {
          await postNow(draft);
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [drafts]);

  const saveDraft = () => {
    if (!content.trim()) return alert("Post cannot be empty!");
    const newDraft: Draft = {
      id: Date.now(),
      content,
      imageUrl: imageUrl || undefined,
      scheduledTime: scheduledTime || undefined,
      status: scheduledTime ? "Scheduled" : "Draft",
    };
    setDrafts([newDraft, ...drafts]);
    setContent("");
    setImageUrl("");
    setScheduledTime("");
  };

  const postNow = async (draft: Draft) => {
    setIsPosting(true);
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: draft.content,
          imageUrl: draft.imageUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to send");

      setDrafts((prev) =>
        prev.map((d) =>
          d.id === draft.id ? { ...d, status: "Posted" } : d
        )
      );
    } catch (err) {
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === draft.id ? { ...d, status: "Failed" } : d
        )
      );
    }
    setIsPosting(false);
  };

  const deleteDraft = (id: number) => {
    setDrafts(drafts.filter((d) => d.id !== id));
  };

  const editDraft = (draft: Draft) => {
    setContent(draft.content);
    setImageUrl(draft.imageUrl || "");
    setScheduledTime(draft.scheduledTime || "");
    deleteDraft(draft.id);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">Draft & Auto-Post App</h1>

      <textarea
        className="w-full max-w-xl p-3 rounded bg-gray-800 text-white"
        placeholder="Write your post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        type="url"
        className="w-full max-w-xl p-3 mt-4 rounded bg-gray-800 text-white"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full max-w-xl mt-2 rounded"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}

      <input
        type="datetime-local"
        className="w-full max-w-xl p-3 mt-4 rounded bg-gray-800 text-white"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
      />

      <button
        onClick={saveDraft}
        className="bg-blue-600 px-4 py-2 mt-4 rounded hover:bg-blue-700"
      >
        Save Draft
      </button>

      <h2 className="text-xl font-bold mt-8">Saved Drafts</h2>

      <div className="w-full max-w-xl mt-4 space-y-4">
        {drafts.length === 0 ? (
          <p className="text-gray-400">No drafts yet.</p>
        ) : (
          drafts.map((draft) => (
            <div key={draft.id} className="p-4 bg-gray-800 rounded">
              <p>{draft.content}</p>

              {draft.imageUrl && (
                <img
                  src={draft.imageUrl}
                  alt="Preview"
                  className="w-full mt-2 rounded"
                />
              )}

              <p className="text-sm text-gray-400">
                Status:{" "}
                {draft.status === "Posted"
                  ? "✅ Posted"
                  : draft.status === "Failed"
                  ? "❌ Failed"
                  : draft.status === "Scheduled"
                  ? "⏰ Scheduled"
                  : "📝 Draft"}
              </p>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => editDraft(draft)}
                  className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteDraft(draft.id)}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                {draft.status !== "Posted" && (
                  <button
                    onClick={() => postNow(draft)}
                    disabled={isPosting}
                    className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 disabled:bg-gray-600"
                  >
                    {isPosting ? "Posting..." : "Post Now"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
