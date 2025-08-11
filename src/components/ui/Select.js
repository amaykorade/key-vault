export default function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`
        block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
        focus:outline-none focus:ring-blue-500 focus:border-blue-500
        bg-white text-gray-900 text-sm
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
} 