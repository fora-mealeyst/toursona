interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mx-auto max-w-2xl text-center">
      <h3 className="text-red-800 font-semibold mb-2">Error</h3>
      <p className="text-red-600">{message}</p>
    </div>
  );
}
