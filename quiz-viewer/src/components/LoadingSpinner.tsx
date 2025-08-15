export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
    <p className="text-gray-600 text-lg">Loading quiz...</p>
    </div>
  );
}
