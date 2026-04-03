export const metadata = {
    title: "TempMail Blog – Temporary Email Guides",
    description:
        "Learn how to use temporary email, avoid spam, and protect your privacy online.",
};

export default function BlogPage() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-20 text-gray-300">

            <h1 className="text-3xl md:text-4xl text-white font-semibold mb-10">
                TempMail Blog
            </h1>

            <div className="grid md:grid-cols-2 gap-6">

                <a
                    href="/blog/temporary-email"
                    className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition block"
                >
                    <h2 className="text-white text-xl font-medium mb-2">
                        What is Temporary Email?
                    </h2>
                    <p className="text-sm text-gray-400">
                        Learn what temporary email is, how it works, and why people use disposable email addresses.
                    </p>
                </a>

                <a
                    href="/blog/free-temporary-email"
                    className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition block"
                >
                    <h2 className="text-white text-xl font-medium mb-2">
                        Free Temporary Email Without Registration
                    </h2>
                    <p className="text-sm text-gray-400">
                        Get a free temp mail instantly without signup and protect your inbox from spam.
                    </p>
                </a>

            </div>
        </div>
    );
}