// Shows "Saved" / error messages passed back in the URL after a form submit.
export default function Notice({ searchParams }) {
  if (searchParams?.error) {
    return (
      <p className="mb-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
        {searchParams.error}
      </p>
    );
  }
  if (searchParams?.saved) {
    return (
      <p className="mb-6 text-sm text-forest-dark bg-sage/20 border border-sage/50 rounded-lg px-4 py-3" role="status">
        Saved. The live site is updated.
      </p>
    );
  }
  return null;
}
