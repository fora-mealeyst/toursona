interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mx-auto max-w-2xl text-center">
      <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error</h3>
      <p className="text-red-600 dark:text-red-300">{message}</p>
    </div>
  );
}
