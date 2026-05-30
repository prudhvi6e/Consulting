export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  authorRole: string;
  content: ArticleSection[];
}

export const articles: Article[] = [
  {
    id: 1,
    slug: "sebi-lodr-key-amendments-2024",
    title: "SEBI LODR Regulations: Key Amendments for 2024",
    excerpt:
      "An in-depth analysis of the recent changes to listing obligations and disclosure requirements affecting mid-cap and large-cap entities.",
    date: "Oct 15, 2024",
    readTime: "5 min read",
    category: "Compliance",
    author: "PS Rao & Associates",
    authorRole: "Securities & Capital Markets Practice",
    content: [
      {
        paragraphs: [
          "The Securities and Exchange Board of India continues to sharpen the Listing Obligations and Disclosure Requirements framework, and the latest round of amendments reflects a clear regulatory intent: faster disclosure, tighter governance, and less room for interpretation. For listed entities, the practical consequence is that compliance can no longer be a quarter-end exercise. It has to be embedded in the way the business runs day to day.",
          "This briefing distils the amendments that matter most for mid-cap and large-cap issuers, and what boards should be doing now to stay ahead of them.",
        ],
      },
      {
        heading: "Materiality and the disclosure clock",
        paragraphs: [
          "The most consequential shift is around the timeline and threshold for disclosing material events. The window for disclosing decisions taken by the board has been compressed, and quantitative thresholds now sit alongside the existing qualitative test. In effect, an event can be material because of its rupee value even where management might once have argued it was not material in substance.",
          "Companies should revisit their materiality policy, recalibrate internal escalation triggers, and ensure the company secretary is looped into deal rooms early rather than after the fact. The cost of a late filing is no longer just a fine; it is a governance signal that institutional investors read closely.",
        ],
      },
      {
        heading: "Board composition and the role of independent directors",
        paragraphs: [
          "Expectations of independent directors continue to rise. The amendments reinforce documentation of the board's deliberations, the rationale for related-party approvals, and the functioning of board committees. Independent directors are increasingly expected to show, on the record, that they questioned management and tested assumptions.",
          "Practically, this means richer board minutes, better pre-read material, and an audit committee that engages with the substance of related-party transactions rather than rubber-stamping them.",
        ],
      },
      {
        heading: "What boards should do now",
        paragraphs: [
          "First, run a gap assessment of the existing disclosure policy against the amended thresholds. Second, rehearse the disclosure workflow end to end, including the chain of approvals, so the compressed timeline is achievable under pressure. Third, treat governance documentation as a defensive asset, not administrative overhead.",
          "Issuers who internalise these changes will find that strong disclosure hygiene becomes a competitive advantage in how the market prices their governance.",
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "fdi-route-changes-tech-sector",
    title: "Navigating FDI Route Changes in the Tech Sector",
    excerpt:
      "How recent FEMA notifications impact foreign direct investment structures for emerging technology startups in India.",
    date: "Sep 28, 2024",
    readTime: "7 min read",
    category: "FEMA",
    author: "PS Rao & Associates",
    authorRole: "RBI & FEMA Advisory Practice",
    content: [
      {
        paragraphs: [
          "Foreign capital remains central to the Indian technology story, but the rules governing how that capital enters the country are in constant motion. Recent notifications under the Foreign Exchange Management Act have refined the contours of the automatic and approval routes, and the details matter enormously for founders structuring a raise.",
          "This piece maps the current landscape and the structuring decisions that most often trip up fast-growing technology companies.",
        ],
      },
      {
        heading: "Automatic route is not a free pass",
        paragraphs: [
          "Most technology sectors permit foreign investment up to one hundred percent under the automatic route, but the reporting obligations that accompany it are unforgiving. The filing of the Foreign Currency Gross Provisional Return and the subsequent share-allotment reporting carry strict timelines, and late compliance now attracts late submission fees that compound quickly.",
          "Founders frequently underestimate that the automatic route removes the need for prior approval, not the need for rigorous, time-bound reporting.",
        ],
      },
      {
        heading: "Pricing, instruments, and downstream investment",
        paragraphs: [
          "Pricing guidelines determine the floor at which shares can be issued to a non-resident, and the choice of instrument, whether equity, compulsorily convertible preference shares, or convertible debentures, has lasting implications for valuation and exit. Convertible instruments must convert on a pre-agreed formula compliant with pricing norms.",
          "Where an Indian company with foreign investment makes a downstream investment into another Indian company, that investment is itself regulated as indirect foreign investment, and the structure must be traced through carefully to avoid an inadvertent breach.",
        ],
      },
      {
        heading: "Structuring for a clean exit",
        paragraphs: [
          "The most common avoidable problem is a cap table that looks attractive to an early investor but creates friction at exit. Build the FEMA compliance trail from day one, keep valuation reports contemporaneous, and document the rationale for every instrument.",
          "A technology company that treats exchange-control compliance as a core part of its corporate hygiene will move faster when a strategic acquirer or a later-stage fund conducts due diligence.",
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "evolving-landscape-corporate-governance",
    title: "The Evolving Landscape of Corporate Governance",
    excerpt:
      "Why independent directors face increased scrutiny and how boards must adapt their internal audit mechanisms.",
    date: "Sep 10, 2024",
    readTime: "6 min read",
    category: "Governance",
    author: "PS Rao & Associates",
    authorRole: "Corporate Governance Practice",
    content: [
      {
        paragraphs: [
          "Corporate governance in India has matured from a compliance checklist into a genuine measure of institutional quality. Regulators, proxy advisers, and institutional investors are aligned in expecting boards to demonstrate not just that decisions were made, but that they were made well.",
          "For boards, the shift is cultural before it is procedural. The strongest boards treat governance as the operating system of the company rather than a layer applied at the end.",
        ],
      },
      {
        heading: "Independent directors under the microscope",
        paragraphs: [
          "The independent director's role has moved decisively from honorary to accountable. Scrutiny now extends to attendance, the quality of questioning recorded in minutes, and the independence of judgement on related-party matters. Directors are expected to bring genuine challenge to the boardroom.",
          "This raises the bar for board induction, ongoing training, and the information directors receive. A board paper that buries the key risk on page forty is no longer acceptable.",
        ],
      },
      {
        heading: "Internal audit as a strategic function",
        paragraphs: [
          "Internal audit is being repositioned from a backward-looking control check into a forward-looking assurance function. Audit committees increasingly expect internal audit to assess emerging risks, the effectiveness of internal financial controls, and the integrity of the data on which the board relies.",
          "The most effective audit committees set a risk-based audit plan, hold management to remediation timelines, and ensure internal audit has a direct, unfiltered line to the committee chair.",
        ],
      },
      {
        heading: "Building durable governance",
        paragraphs: [
          "Durable governance is built on three habits: clear delegation of authority, honest and timely information flow to the board, and a culture in which raising a concern is rewarded rather than penalised.",
          "Companies that embed these habits find that good governance lowers their cost of capital and earns them the benefit of the doubt when markets turn volatile.",
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "ma-trends-fast-track-mergers",
    title: "M&A Trends: Fast-Track Mergers Demystified",
    excerpt:
      "A practical guide to utilizing the Section 233 fast-track merger route under the Companies Act, 2013.",
    date: "Aug 22, 2024",
    readTime: "8 min read",
    category: "Restructuring",
    author: "PS Rao & Associates",
    authorRole: "Mergers & Restructuring Practice",
    content: [
      {
        paragraphs: [
          "Not every merger needs to pass through the National Company Law Tribunal. For a defined set of companies, the fast-track route under Section 233 of the Companies Act offers a faster, lower-cost path to consolidation, provided the eligibility conditions are met and the process is run with discipline.",
          "This guide explains who can use the route, how it works in practice, and where deals tend to stumble.",
        ],
      },
      {
        heading: "Who qualifies",
        paragraphs: [
          "The fast-track route is available to mergers between two or more small companies, between a holding company and its wholly owned subsidiary, and to certain other prescribed classes such as start-ups. Because it bypasses the tribunal, the route depends heavily on the approval of the Regional Director and the absence of unresolved objections from the Registrar of Companies and the Official Liquidator.",
          "Confirming eligibility at the outset is critical; a misjudged route choice can cost months when the scheme has to be re-filed through the tribunal process.",
        ],
      },
      {
        heading: "The mechanics of the scheme",
        paragraphs: [
          "The process turns on member and creditor approval thresholds, a properly drafted scheme of merger, and accurate filings with the relevant authorities. Notice must be given to the regulators, objections and suggestions must be invited, and the companies must hold meetings of members and creditors, or obtain the requisite written consents.",
          "Once approvals are in place, the Regional Director registers the scheme, and the merger takes effect. Clean drafting of the appointed date, the treatment of employees, and the accounting treatment prevents disputes after closing.",
        ],
      },
      {
        heading: "Where deals go wrong",
        paragraphs: [
          "The most frequent failures are avoidable: incomplete creditor consents, an ambiguous appointed date, and undervalued attention to tax and stamp-duty consequences. Each of these can convert a supposedly fast-track merger into a slow one.",
          "Run the eligibility test honestly, prepare the consents early, and align the legal, tax, and accounting workstreams from the start. Done well, the fast-track route is one of the most efficient consolidation tools available under Indian law.",
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlePlainText(article: Article): string {
  const body = article.content
    .map((section) => {
      const head = section.heading ? `${section.heading}. ` : "";
      return head + section.paragraphs.join(" ");
    })
    .join("\n\n");
  return `${article.title}.\n\n${body}`;
}
