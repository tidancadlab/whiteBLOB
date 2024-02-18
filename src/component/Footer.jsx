function Footer() {
    return (
        <footer style={{ backgroundColor: '#f2f2f2', padding: '20px', textAlign: 'center' }}>
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