const Header = ({login}) => {
    return (
        <header className="bg-[#00D9FF] text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">VitaLink</h1>
          <nav className="space-x-4">
            <a href="/" className="text-white hover:text-[#00D9FF]">Home</a>
            <a href="/about" className="text-white hover:text-[#00D9FF]">About</a>
            <a href="/contact" className="text-white hover:text-[#00D9FF]">Contact</a>
            {login? <a href="/register" className="text-white hover:text-[#00D9FF]">Register</a> :
            <a href="/login" className="text-white hover:text-[#00D9FF]">Login</a>}
          </nav>
        </div>
      </header>
    )
}

export default Header;