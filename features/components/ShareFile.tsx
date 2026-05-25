export function ShareFile() {
  return (
    <>
      <div className="w-[320px] border-l bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Shared Documents</h2>
          <p className="text-sm text-gray-500">
            Files and resources in this conversation
          </p>
        </div>
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search document..."
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {[
            {
              id: 1,
              name: "Project Requirement.pdf",
              type: "PDF",
              size: "2.4 MB",
              uploadedBy: "Admin",
            },
            {
              id: 2,
              name: "UI Design.fig",
              type: "FIGMA",
              size: "5.8 MB",
              uploadedBy: "Designer",
            },
            {
              id: 3,
              name: "API Collection.json",
              type: "JSON",
              size: "450 KB",
              uploadedBy: "Developer",
            },
            {
              id: 4,
              name: "Database Schema.sql",
              type: "SQL",
              size: "120 KB",
              uploadedBy: "Tester",
            },
          ].map((doc) => (
            <div
              key={doc.id}
              className="border rounded-xl p-3 hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  {/* File Icon */}
                  <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {doc.type}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-medium text-sm line-clamp-1">
                      {doc.name}
                    </h3>

                    <div className="text-xs text-gray-500 mt-1">{doc.size}</div>

                    <div className="text-xs text-gray-400 mt-0.5">
                      Uploaded by {doc.uploadedBy}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <button className="text-gray-400 hover:text-black">⋮</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
            Upload Document
          </button>
        </div>
      </div>
    </>
  );
}
