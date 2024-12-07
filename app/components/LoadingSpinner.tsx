interface Props {
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ size = 'md' }: Props) {
  const sizeClass = {
    sm: 'spinner-sm',
    md: '',
    lg: 'spinner-lg'
  }[size];

  return (
    <div className="flex items-center justify-center">
      <div className={`spinner ${sizeClass}`} />
    </div>
  );
} 