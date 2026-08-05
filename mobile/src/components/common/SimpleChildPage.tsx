export function SimpleChildPage({ title, description }: { title: string; description: string }) {
  return <section className="empty"><span>✟</span><h1>{title}</h1><p>{description}</p></section>;
}
