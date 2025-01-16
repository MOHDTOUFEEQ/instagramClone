
function NonAuthenticatedUser() {
  return (
    <div className="rounded-md border-l-4 border-yellow-500 bg-yellow-100 p-4">
        <div className="flex items-center justify-between space-x-4">
            <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-yellow-600"
            >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            </div>
            <div>
            <p className="text-sm font-medium text-yellow-600">
              To view this page, you must first log in.
            </p>
            </div>
            <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 cursor-pointer text-yellow-600"
            >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            </div>
        </div>
    </div>

  )
}

export default NonAuthenticatedUser