interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm';
}

export function Button({ 
  children, 
  className = "", 
  isLoading = false, 
  variant = 'default',
  size = 'default',
  ...props 
}: ButtonProps) {
  const baseStyles = "w-full max-w-xs mx-auto block transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-[#7C65C1] text-white disabled:hover:bg-[#7C65C1] hover:bg-[#6952A3]",
    outline: "border border-[#7C65C1] text-[#7C65C1] hover:bg-[#7C65C1] hover:text-white"
  };

  const sizes = {
    default: "py-3 px-6",
    sm: "py-2 px-4 text-sm"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
