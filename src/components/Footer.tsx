const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-2">
          <p className="text-2xl font-bold text-primary">Costa's Takeaway</p>
          <p className="text-muted-foreground">
            Fresh fish & chips, cooked to perfection
          </p>
          <p className="text-sm text-muted-foreground pt-4">
            © {currentYear} Costa's Takeaway. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
