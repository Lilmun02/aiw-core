import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

const policies = {
  terms: {
    label: "Terms of Service",
    title: "AIWCORE Terms of Service",
    intro:
      "These Terms govern your access to and use of AIWCORE, including accounts, profiles, AI-tool discovery, submissions, feedback, notifications, and Founder Support.",
    sections: [
      [
        "1. Acceptance of these Terms",
        "By accessing AIWCORE or creating an account, you agree to these Terms and the Privacy Policy. If you do not agree, do not use AIWCORE.",
      ],
      [
        "2. Eligibility and accounts",
        "You must provide accurate information, protect your login credentials, and take responsibility for activity on your account. AIWCORE is not intended for children under 13. We may suspend or remove accounts that violate these Terms, create security risks, or misuse the platform.",
      ],
      [
        "3. AI-tool information and external links",
        "AIWCORE helps users discover and compare third-party AI tools. Listings, descriptions, ratings, links, and availability may change. AIWCORE does not own, control, endorse, or guarantee third-party tools unless expressly stated. Your use of an external service is governed by that service's own terms and privacy practices.",
      ],
      [
        "4. User submissions and feedback",
        "You may submit tools, profile information, reviews, suggestions, bug reports, and other content. You retain ownership of your content, but grant AIWCORE a non-exclusive, worldwide, royalty-free license to host, display, format, and use it as needed to operate, improve, and promote the platform. You must have the right to submit the content and must not submit unlawful, deceptive, infringing, harmful, or abusive material.",
      ],
      [
        "5. Acceptable use",
        "Do not attempt unauthorized access, disrupt service, scrape or automate access in a harmful way, impersonate others, upload malicious code, exploit security weaknesses, manipulate ratings, or use AIWCORE for unlawful activity. Responsible security reports should be submitted through AIWCORE's feedback channel.",
      ],
      [
        "6. Founder Support",
        "Founder Support is an optional one-time purchase that provides the benefits described on the Founder Support page and in the Founder Support Terms. It is not an investment, ownership interest, security, promise of profit, or guarantee that every future benefit will be released.",
      ],
      [
        "7. Intellectual property",
        "AIWCORE's name, branding, original design, software, and platform content are protected by applicable intellectual-property laws. Third-party names, logos, and content belong to their respective owners. No license is granted except the limited right to use AIWCORE under these Terms.",
      ],
      [
        "8. Availability and changes",
        "AIWCORE may add, modify, pause, or remove features and may experience interruptions. We may update these Terms by posting a revised version and effective date. Continued use after an update means you accept the revised Terms where permitted by law.",
      ],
      [
        "9. Disclaimers and limitation of liability",
        "AIWCORE is provided on an 'as is' and 'as available' basis to the extent permitted by law. We do not guarantee uninterrupted service, perfect accuracy, or that third-party tools will meet your needs. To the maximum extent permitted by law, AIWCORE will not be liable for indirect, incidental, special, consequential, or punitive damages arising from use of the platform or third-party services.",
      ],
      [
        "10. Contact",
        "Questions about these Terms may be submitted through the AIWCORE feedback page. These Terms should be reviewed by a qualified attorney as AIWCORE grows, expands into new jurisdictions, or introduces additional paid services.",
      ],
    ],
  },
  privacy: {
    label: "Privacy Policy",
    title: "AIWCORE Privacy Policy",
    intro:
      "This Policy explains what information AIWCORE collects, why it is used, when it may be shared, and the choices available to users.",
    sections: [
      [
        "1. Information we collect",
        "We may collect account information such as email address, display name, profile image, biography, authentication identifiers, account role, saved tools, streaks, achievements, submissions, feedback, notification subscription data, and Founder Support status. Payment-card details are handled by Stripe and do not pass through AIWCORE's servers.",
      ],
      [
        "2. Technical information",
        "AIWCORE and its service providers may process device, browser, IP-address, request, error, security, and usage information needed to operate, protect, troubleshoot, and improve the platform. The PWA may use browser storage, caches, a service worker, and push-notification technology.",
      ],
      [
        "3. How information is used",
        "Information is used to create and secure accounts, provide profile and discovery features, remember preferences, process tool submissions, send notifications users choose to receive, verify Founder Support purchases, prevent abuse, troubleshoot errors, measure platform performance, and improve AIWCORE.",
      ],
      [
        "4. Service providers",
        "AIWCORE relies on service providers including Supabase for database and authentication services, Vercel for hosting and deployment, Stripe for payment processing, and browser or device push-notification services. These providers process information under their own terms and privacy practices and only as needed to deliver their services.",
      ],
      [
        "5. Sharing of information",
        "AIWCORE does not sell personal information. Information may be shared with service providers, when a user directs us to share it, to protect rights and security, to investigate abuse, to comply with law, or as part of a merger, acquisition, financing, or transfer of the platform subject to appropriate protections.",
      ],
      [
        "6. Public information",
        "Profile names, images, biographies, badges, reviews, submitted tools, or other content may be public when the feature is designed for public display. Do not publish information you want to keep private.",
      ],
      [
        "7. Data retention and security",
        "We retain information for as long as reasonably needed to operate AIWCORE, meet legal obligations, resolve disputes, prevent abuse, and enforce agreements. We use reasonable technical and organizational safeguards, but no online system can guarantee absolute security.",
      ],
      [
        "8. Your choices",
        "You may update certain profile details, disable push notifications through your browser or device settings, and request account or data assistance through the feedback page. Some records may be retained when required for security, legal, fraud-prevention, or transaction-record purposes.",
      ],
      [
        "9. Children",
        "AIWCORE is a general-audience platform and is not directed to children under 13. We do not knowingly collect personal information from children under 13. If such information is identified, contact AIWCORE through the feedback page so it can be reviewed and deleted where appropriate.",
      ],
      [
        "10. Updates and contact",
        "We may update this Policy as AIWCORE changes. The current version and effective date will remain posted here. Privacy questions or requests may be submitted through the AIWCORE feedback page.",
      ],
    ],
  },
  founder: {
    label: "Founder Support Terms",
    title: "Founder Support Program Terms",
    intro:
      "These terms apply specifically to the optional AIWCORE Founder Support Program and supplement the general Terms of Service and Privacy Policy.",
    sections: [
      [
        "1. One-time purchase",
        "Founder Support currently costs $49 USD as a one-time payment, unless a different price is clearly displayed at checkout. It is not a recurring subscription.",
      ],
      [
        "2. What Founder Support provides",
        "After verified payment, the purchasing account may receive permanent Founder Supporter recognition, a profile badge, a supported-since date, a digital certificate when available, eligible early-access opportunities, supporter announcements, feedback opportunities, and future benefits AIWCORE may introduce.",
      ],
      [
        "3. Nature of the program",
        "Founder Support is a purchase supporting AIWCORE's development and mission. It does not provide equity, ownership, voting control, employment, partnership status, revenue share, investment returns, or a financial interest in AIWCORE.",
      ],
      [
        "4. Benefits may evolve",
        "Permanent recognition will not be intentionally removed from an account in good standing, but specific optional or future benefits may change, be delayed, or become unavailable as the platform develops. Founder Support does not guarantee the release of any particular feature.",
      ],
      [
        "5. Account requirement and transfer",
        "Founder Support is attached to the authenticated AIWCORE account used for checkout. Benefits are personal to that account and may not be sold, transferred, duplicated, or combined across accounts without written approval from AIWCORE.",
      ],
      [
        "6. Payments and refunds",
        "Payments are processed by Stripe. Except where required by law, completed Founder Support purchases are generally non-refundable because permanent account recognition is activated after verified payment. Duplicate charges, unauthorized transactions, or technical failures will be reviewed when promptly reported through the feedback page.",
      ],
      [
        "7. Revocation for abuse",
        "AIWCORE may suspend access to program benefits when an account engages in fraud, chargeback abuse, unlawful activity, platform manipulation, harassment, security attacks, or material violations of the Terms of Service. Transaction records may be retained as required for legal, security, and accounting purposes.",
      ],
      [
        "8. Founder account",
        "AIWCORE's designated Founder account receives Founder status and related benefits without purchasing Founder Support. Founder status is distinct from the Founder Supporter status offered to users.",
      ],
      [
        "9. Contact",
        "Questions about a purchase, benefit, duplicate charge, or account activation should be submitted through the AIWCORE feedback page with enough information to locate the transaction. Never include full card details in a message.",
      ],
    ],
  },
};

function LegalPage({ policy = "terms" }) {
  const navigate = useNavigate();
  const content = policies[policy] || policies.terms;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `${content.label} | AIWCORE`;
    return () => {
      document.title = "AIWCORE";
    };
  }, [content.label]);

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      <Navbar onLogoClick={() => navigate("/")} />
      <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-10 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          ← Go back
        </button>

        <header className="mt-8 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/60 via-slate-950 to-[#0b1220] p-7 sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-400">
            AIWCORE Legal
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-5 leading-7 text-slate-300">{content.intro}</p>
          <p className="mt-5 text-sm font-semibold text-slate-500">
            Effective date: August 4, 2026
          </p>
        </header>

        <div className="mt-8 space-y-5">
          {content.sections.map(([heading, body]) => (
            <section
              key={heading}
              className="rounded-2xl border border-slate-800 bg-[#0d1526] p-6 sm:p-7"
            >
              <h2 className="text-xl font-black text-white">{heading}</h2>
              <p className="mt-3 leading-7 text-slate-300">{body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5 text-sm leading-6 text-amber-100/80">
          These policies are AIWCORE's current operational terms and are not a
          substitute for advice from a licensed attorney. They should be
          professionally reviewed as the platform, paid services, or geographic
          reach expands.
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LegalPage;
