export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/logo.png"
            alt="Logo"
            className="h-20 w-auto"
        />
    );
}