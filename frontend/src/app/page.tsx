"use server";

export default async function Home() {
  return (
    <div>
      <p>Hello! From, {process.env.NODE_ENV}</p>
    </div>
  );
}
