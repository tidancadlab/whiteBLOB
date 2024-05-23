function Footer() {
    return (
        <footer className="bg-white p-6 text-center">
            <p style={{ margin: 0, color: '#555' }}>
                {'© '}{new Date().getFullYear()}{' '}
                <a href="https://whiteBLOB.site" style={{ color: '#007bff', textDecoration: 'none' }}>
                    whiteBLOB.site
                </a>{' '}
                All Rights Reserved
            </p>
        </footer>
    );
}

export default Footer;