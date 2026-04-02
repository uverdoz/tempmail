export default function Privacy() {
    return (
        <main
            style={{
                padding: "60px 20px",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    maxWidth: "900px",
                    width: "100%",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "16px",
                    padding: "40px",
                    border: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
                    Privacy Policy
                </h1>

                <p style={{ opacity: 0.6, marginBottom: "30px" }}>
                    Last updated: 2026
                </p>

                {/* SECTION */}
                <Section title="1. Introduction">
                    TempFastMail respects your privacy and is committed to protecting your
                    data. This Privacy Policy explains how our temporary email service
                    works and what information is (and is not) collected.
                </Section>

                <Section title="2. No Personal Data Collection">
                    We do not require registration and do not collect personally
                    identifiable information such as your name, phone number, or address.
                </Section>

                <Section title="3. Temporary Email Transparency">
                    All generated email addresses are public. Messages sent to these
                    addresses may be accessible by anyone who knows the address.
                    <br />
                    <br />
                    <strong>
                        Do not use this service for sensitive or private communication.
                    </strong>
                </Section>

                <Section title="4. Automatically Collected Data">
                    We may collect basic technical data:
                    <ul>
                        <li>IP address</li>
                        <li>Browser type</li>
                        <li>Device type</li>
                        <li>Pages visited</li>
                        <li>Time spent on the site</li>
                    </ul>
                </Section>

                <Section title="5. Cookies">
                    Cookies are used to improve user experience and understand how the
                    service is used.
                </Section>

                <Section title="6. Analytics">
                    We use analytics tools (like Vercel Analytics) to measure traffic and
                    performance in an anonymous way.
                </Section>

                <Section title="7. Third-Party Services">
                    We use trusted providers such as Mailgun to process incoming emails.
                    These services operate under their own privacy policies.
                </Section>

                <Section title="8. Data Retention">
                    Emails are stored temporarily and automatically deleted after a short
                    period.
                </Section>

                <Section title="9. Security">
                    We apply reasonable security measures, but no system is 100% secure.
                </Section>

                <Section title="10. Children's Privacy">
                    This service is not intended for users under 13.
                </Section>

                <Section title="11. Updates">
                    We may update this policy at any time. Changes will appear on this page.
                </Section>

                <Section title="12. Contact">
                    contact@tempfastmail.site
                </Section>

                <div
                    style={{
                        marginTop: "40px",
                        paddingTop: "20px",
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        opacity: 0.6,
                        fontSize: "14px",
                    }}
                >
                    This policy is provided to comply with Google AdSense and general data
                    protection standards.
                </div>
            </div>
        </main>
    );
}

/* 🔥 КРАСИВЫЙ КОМПОНЕНТ СЕКЦИИ */
function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ marginBottom: "30px" }}>
            <h2
                style={{
                    fontSize: "20px",
                    marginBottom: "10px",
                    color: "#fff",
                }}
            >
                {title}
            </h2>

            <div
                style={{
                    opacity: 0.8,
                    lineHeight: "1.7",
                    fontSize: "15px",
                }}
            >
                {children}
            </div>
        </div>
    );
}