import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="band-ink border-t border-border/20 py-8 text-center text-caption">
      <Container>
        <p>&copy; {new Date().getFullYear()} RevoShop. by triwahyu.</p>
        <p>contact : triwahyu10100@gmail.com</p>
      </Container>
    </footer>
  );
}
