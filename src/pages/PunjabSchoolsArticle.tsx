import { useNavigate } from "react-router-dom";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import SEOHead from "@/components/SEOHead";
import { Helmet } from "react-helmet-async";

const PunjabSchoolsArticle = () => {
  const navigate = useNavigate();

  const metaData = {
    title: "Rana Sikandar Hayat Ka U-Turn: Punjab Schools 31 March Tak Band, Online Classes Shuru | Apna Tuition",
    description: "Punjab Education Minister Rana Sikandar Hayat ne pehle schools open rehne ka ailan kiya, phir 3 din mein U-turn lete hue 31 March tak tamam schools band karne ka hukam de diya. Board exams schedule par honge.",
    keywords: "Rana Sikandar Hayat, Rana Sikandar Hayat statement, Punjab school band, Punjab schools closed March 2026, online classes Punjab, Punjab school closure, board exams 2026, matric exams 2026, intermediate exams 2026, Punjab Education Minister, Punjab online tuition, home tutor Punjab, U-turn Punjab schools, schools closed Pakistan, Punjab academic news, O level exams 2026, A level exams 2026, apna tuition, online tutor Pakistan, home tutor Lahore",
    canonical: "https://apna-tuition.com/blog/rana-sikandar-hayat-punjab-schools-band-march-2026",
    ogImage: "/blog-images/rana-sikandar-hayat-schools-closed.jpeg"
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "Rana Sikandar Hayat Ka U-Turn: Punjab Schools 31 March Tak Band, Online Classes Shuru",
    "description": "Punjab Education Minister Rana Sikandar Hayat ne 3 din mein U-turn lete hue Punjab ke tamam schools 31 March tak band karne ka official hukam de diya.",
    "datePublished": "2026-03-10",
    "dateModified": "2026-03-10",
    "author": { "@type": "Organization", "name": "Apna Tuition" },
    "publisher": { "@type": "Organization", "name": "Apna Tuition", "url": "https://apna-tuition.com" },
    "keywords": ["Rana Sikandar Hayat","Punjab schools closed","online classes Punjab","board exams 2026","matric exams","school closure Pakistan"]
  };

  return (
    <>
      <SEOHead
        title={metaData.title}
        description={metaData.description}
        canonical={metaData.canonical}
        keywords={metaData.keywords}
        ogImage={metaData.ogImage}
        ogType="article"
        schema={articleSchema}
      />
      
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
        <style>{`
          :root{
            --red:#c0392b; --navy:#1a2e4a; --gold:#e8a020;
            --light-bg:#f4f1eb; --text:#1c1c1c; --muted:#6b6b6b;
            --border:#ddd5c8;
            --ad-bg:linear-gradient(145deg,#0d1f35 0%,#1a3a5c 50%,#0d2d4a 100%);
          }

          .punjab-article-wrapper {
            font-family:'Source Serif 4',Georgia,serif;
            background:var(--light-bg);
            color:var(--text);
            line-height:1.8;
          }

          .punjab-article-wrapper .top-bar{background:var(--navy);color:#fff;font-family:'DM Sans',sans-serif;font-size:12px;padding:7px 20px;display:flex;justify-content:space-between;align-items:center; flex-wrap:wrap;}
          .punjab-article-wrapper .top-bar a{color:var(--gold);text-decoration:none;font-weight:600;}

          .punjab-article-wrapper .page-wrapper{max-width:1280px;margin:0 auto;padding:28px 20px;display:grid;grid-template-columns:1fr 290px;gap:36px;align-items:start;}

          .punjab-article-wrapper .article-col{min-width:0;}

          .punjab-article-wrapper .category-tag{display:inline-block;background:var(--red);color:#fff;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;padding:4px 14px;border-radius:2px;margin-bottom:16px;}

          .punjab-article-wrapper h1{font-family:'Playfair Display',serif;font-size:34px;font-weight:800;line-height:1.25;color:var(--navy);margin-bottom:16px;}

          .punjab-article-wrapper .breaking-badge{display:inline-flex;align-items:center;gap:7px;background:var(--red);color:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;padding:5px 14px;border-radius:3px;margin-bottom:14px;letter-spacing:.5px;}
          .punjab-article-wrapper .breaking-badge .dot{width:8px;height:8px;background:#fff;border-radius:50%;animation:blink 1s infinite;}
          @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}

          .punjab-article-wrapper .meta-bar{font-family:'DM Sans',sans-serif;font-size:13px;color:var(--muted);border-top:2px solid var(--navy);border-bottom:1px solid var(--border);padding:10px 0;margin-bottom:22px;display:flex;flex-wrap:wrap;gap:18px;}

          .punjab-article-wrapper .hero-img{width:100%;border-radius:4px;margin-bottom:8px;overflow:hidden;}
          .punjab-article-wrapper .hero-img img{width:100%;height:auto;display:block;}
          .punjab-article-wrapper .img-caption{font-family:'DM Sans',sans-serif;font-size:11.5px;color:var(--muted);font-style:italic;margin-bottom:26px;padding:6px 0;border-bottom:1px solid var(--border);}

          .punjab-article-wrapper .uturn-box{background:#fff8e1;border:1px solid #f0c040;border-left:5px solid var(--gold);border-radius:4px;padding:18px 22px;margin:24px 0;font-family:'DM Sans',sans-serif;}
          .punjab-article-wrapper .uturn-box h3{font-size:13px;text-transform:uppercase;letter-spacing:1.2px;color:#8a6000;margin-bottom:14px;}
          .punjab-article-wrapper .timeline{display:flex;flex-direction:column;}
          .punjab-article-wrapper .tl-item{display:flex;gap:14px;align-items:flex-start;}
          .punjab-article-wrapper .tl-line{display:flex;flex-direction:column;align-items:center;}
          .punjab-article-wrapper .tl-dot{width:14px;height:14px;border-radius:50%;flex-shrink:0;margin-top:3px;}
          .punjab-article-wrapper .tl-dot.green{background:#27ae60;}
          .punjab-article-wrapper .tl-dot.red{background:var(--red);}
          .punjab-article-wrapper .tl-connector{width:2px;height:28px;background:var(--border);}
          .punjab-article-wrapper .tl-text{font-size:13.5px;padding-bottom:20px;}
          .punjab-article-wrapper .tl-text strong{display:block;font-size:12px;color:var(--muted);margin-bottom:2px;}

          .punjab-article-wrapper .highlights-box{border-left:5px solid var(--red);background:#fff5f5;padding:18px 22px;margin:26px 0;border-radius:0 4px 4px 0;font-family:'DM Sans',sans-serif;}
          .punjab-article-wrapper .highlights-box h3{font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:var(--red);margin-bottom:12px;}
          .punjab-article-wrapper .highlights-box ul{list-style:none;}
          .punjab-article-wrapper .highlights-box ul li{font-size:14.5px;padding:5px 0 5px 24px;position:relative;color:#222;}
          .punjab-article-wrapper .highlights-box ul li::before{content:"▸";color:var(--red);position:absolute;left:0;}

          .punjab-article-wrapper blockquote{border-left:4px solid var(--navy);margin:28px 0;padding:18px 24px;background:#f0f4f8;font-style:italic;font-size:18px;color:var(--navy);border-radius:0 4px 4px 0;font-family:'Playfair Display',serif;}
          .punjab-article-wrapper blockquote cite{display:block;margin-top:10px;font-size:12px;font-style:normal;font-family:'DM Sans',sans-serif;color:var(--muted);}

          .punjab-article-wrapper p{margin-bottom:20px;font-size:16.5px;}
          .punjab-article-wrapper h2{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;margin:36px 0 14px;color:var(--navy);border-bottom:2px solid var(--border);padding-bottom:8px;}

          .punjab-article-wrapper table{width:100%;border-collapse:collapse;margin:20px 0 30px;font-family:'DM Sans',sans-serif;font-size:14px;}
          .punjab-article-wrapper th{background:var(--navy);color:#fff;padding:12px 16px;text-align:left;}
          .punjab-article-wrapper td{padding:11px 16px;border-bottom:1px solid var(--border);}
          .punjab-article-wrapper tr:nth-child(even) td{background:#f0ede6;}

          .punjab-article-wrapper .tags{margin:30px 0;display:flex;flex-wrap:wrap;gap:8px;}
          .punjab-article-wrapper .tags a{font-family:'DM Sans',sans-serif;font-size:12px;background:#eee8de;color:var(--navy);padding:5px 13px;border-radius:20px;text-decoration:none;border:1px solid var(--border);transition:all .2s;}
          .punjab-article-wrapper .tags a:hover{background:var(--navy);color:#fff;}

          .punjab-article-wrapper .sources{font-family:'DM Sans',sans-serif;font-size:12px;color:var(--muted);border-top:1px solid var(--border);padding-top:16px;margin-top:40px;line-height:2;}
          .punjab-article-wrapper .sources a{color:#2e6da4;text-decoration:none;}

          .punjab-article-wrapper .ad-horizontal{background:var(--ad-bg);border-radius:8px;padding:26px 28px;margin:36px 0;display:flex;align-items:center;gap:22px;text-decoration:none;cursor:pointer;transition:transform .2s,box-shadow .2s;border:1px solid rgba(255,255,255,.08);position:relative;overflow:hidden;}
          .punjab-article-wrapper .ad-horizontal::after{content:'';position:absolute;top:-50%;right:-60px;width:220px;height:220px;background:radial-gradient(circle,rgba(232,160,32,.15) 0%,transparent 70%);pointer-events:none;}
          .punjab-article-wrapper .ad-horizontal:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,.25);}
          .punjab-article-wrapper .ad-h-icon{font-size:44px;flex-shrink:0;}
          .punjab-article-wrapper .ad-h-text{flex:1;}
          .punjab-article-wrapper .ad-label{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-bottom:5px;display:block;}
          .punjab-article-wrapper .ad-h-text h3{color:#fff;font-family:'Playfair Display',serif;font-size:20px;margin-bottom:6px;line-height:1.3;}
          .punjab-article-wrapper .ad-h-text p{color:rgba(255,255,255,.75);font-family:'DM Sans',sans-serif;font-size:13.5px;margin:0;line-height:1.5;}
          .punjab-article-wrapper .ad-h-cta{background:var(--gold);color:#000;font-family:'DM Sans',sans-serif;font-weight:700;font-size:13px;padding:11px 22px;border-radius:5px;white-space:nowrap;flex-shrink:0;}

          .punjab-article-wrapper .ad-bottom{background:linear-gradient(135deg,#0d2d1a 0%,#1a5c3a 50%,#0d3320 100%);border-radius:8px;padding:32px 28px;margin:40px 0 10px;text-align:center;text-decoration:none;display:block;cursor:pointer;transition:transform .2s,box-shadow .2s;border:1px solid rgba(255,255,255,.08);position:relative;overflow:hidden;}
          .punjab-article-wrapper .ad-bottom:hover{transform:translateY(-2px);box-shadow:0 12px 35px rgba(0,0,0,.3);}
          .punjab-article-wrapper .ad-bottom::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(100,220,130,.08) 0%,transparent 70%);}
          .punjab-article-wrapper .ad-bottom h3{color:#fff;font-family:'Playfair Display',serif;font-size:26px;margin-bottom:12px;position:relative;}
          .punjab-article-wrapper .ad-bottom p{color:rgba(255,255,255,.78);font-family:'DM Sans',sans-serif;font-size:15px;margin-bottom:20px;max-width:600px;margin-left:auto;margin-right:auto;position:relative;}
          .punjab-article-wrapper .ad-bottom-features{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:24px;position:relative;}
          .punjab-article-wrapper .ad-feat{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;padding:6px 16px;border-radius:20px;}
          .punjab-article-wrapper .ad-bottom-cta{display:inline-block;background:#2ecc71;color:#000;font-family:'DM Sans',sans-serif;font-weight:700;font-size:16px;padding:14px 36px;border-radius:6px;position:relative;}

          .punjab-article-wrapper .sidebar-col{position:sticky;top:20px;}

          .punjab-article-wrapper .ad-sidebar{background:var(--ad-bg);border-radius:8px;padding:24px 18px;text-align:center;text-decoration:none;display:block;cursor:pointer;transition:transform .2s,box-shadow .2s;border:1px solid rgba(255,255,255,.08);margin-bottom:24px;position:relative;overflow:hidden;}
          .punjab-article-wrapper .ad-sidebar:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(0,0,0,.35);}
          .punjab-article-wrapper .ad-sidebar::before{content:'';position:absolute;bottom:-30px;left:-30px;width:140px;height:140px;background:radial-gradient(circle,rgba(232,160,32,.12) 0%,transparent 70%);}
          .punjab-article-wrapper .ad-sidebar .ad-icon{font-size:44px;margin-bottom:14px;}
          .punjab-article-wrapper .ad-sidebar h3{color:#fff;font-family:'Playfair Display',serif;font-size:18px;line-height:1.3;margin-bottom:10px;position:relative;}
          .punjab-article-wrapper .ad-sidebar p{color:rgba(255,255,255,.72);font-family:'DM Sans',sans-serif;font-size:12.5px;line-height:1.6;margin-bottom:16px;position:relative;}
          .punjab-article-wrapper .ad-sidebar-features{margin-bottom:18px;}
          .punjab-article-wrapper .ad-sf{display:flex;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;font-size:12.5px;color:rgba(255,255,255,.85);padding:4px 0;text-align:left;}
          .punjab-article-wrapper .ad-sf::before{content:"✓";color:var(--gold);font-weight:700;flex-shrink:0;}
          .punjab-article-wrapper .ad-sidebar-cta{display:block;background:var(--gold);color:#000;font-family:'DM Sans',sans-serif;font-weight:700;font-size:13px;padding:11px 16px;border-radius:5px;position:relative;text-decoration:none;}

          .punjab-article-wrapper .sidebar-trending{background:#fff;border:1px solid var(--border);border-radius:6px;padding:18px;}
          .punjab-article-wrapper .sidebar-trending h4{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--red);margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid var(--border);}
          .punjab-article-wrapper .trending-item{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);font-family:'DM Sans',sans-serif;}
          .punjab-article-wrapper .trending-item:last-child{border-bottom:none;}
          .punjab-article-wrapper .trending-num{color:var(--red);font-weight:700;font-size:18px;flex-shrink:0;line-height:1.2;}
          .punjab-article-wrapper .trending-title{font-size:13px;color:var(--navy);line-height:1.4;font-weight:500;}

          @media(max-width:900px){
            .punjab-article-wrapper .page-wrapper{grid-template-columns:1fr;}
            .punjab-article-wrapper .sidebar-col{position:static;}
            .punjab-article-wrapper .ad-horizontal{flex-direction:column;text-align:center;}
            .punjab-article-wrapper .ad-h-cta{width:100%;text-align:center;padding:13px;}
            .punjab-article-wrapper h1{font-size:26px;}
          }
        `}</style>
      </Helmet>

      <div className="min-h-screen bg-white">
        <LandingNavbar />
        
        <div className="punjab-article-wrapper">
          <div className="top-bar">
            <span>📍 Pakistan Education News — Latest Updates</span>
            <span>📚 Need a Tutor? <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Visit Apna Tuition →</a></span>
          </div>

          <div className="page-wrapper">
            {/* MAIN ARTICLE */}
            <main className="article-col">
              <span className="breaking-badge"><span className="dot"></span> BREAKING NEWS</span>
              <span className="category-tag">📰 Punjab Education — March 2026</span>

              <h1>Rana Sikandar Hayat Ka Bara U-Turn: Pehle Kaha Schools Open Hain, 3 Din Baad Punjab Ke Tamam Schools 31 March Tak Band</h1>

              <div className="meta-bar">
                <span>🗓️ March 10, 2026</span>
                <span>✍️ Apna Tuition News Desk</span>
                <span>📍 Lahore, Punjab</span>
                <span>⏱️ 5 min read</span>
              </div>

              <div className="hero-img">
                <img src="/blog-images/rana-sikandar-hayat-schools-closed.jpeg" alt="Rana Sikandar Hayat - Punjab Education Minister" />
              </div>
              <p className="img-caption">Punjab Education Minister Rana Sikandar Hayat. (Source: ARY News / Geo TV)</p>

              {/* U-Turn Timeline */}
              <div className="uturn-box">
                <h3>⚡ 3 Din Ka U-Turn — Timeline</h3>
                <div className="timeline">
                  <div className="tl-item">
                    <div className="tl-line"><div className="tl-dot green"></div><div className="tl-connector"></div></div>
                    <div className="tl-text">
                      <strong>March 6, 2026 — Sarkari Byan</strong>
                      "Schools are open. No closures, no online classes. Rumors par dhyan na dein." — Rana Sikandar Hayat (Official X/Twitter)
                    </div>
                  </div>
                  <div className="tl-item">
                    <div className="tl-line"><div className="tl-dot red"></div></div>
                    <div className="tl-text">
                      <strong>March 9, 2026 — Naya Hukam (Sirf 72 Ghante Baad!)</strong>
                      Punjab ke tamam schools, colleges aur universities <strong>31 March tak band</strong>. Online mode mandatory. Sirf board exams schedule par.
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="highlights-box">
                <h3>🔑 Key Points at a Glance</h3>
                <ul>
                  <li>Punjab ke tamam sarkari aur private schools, colleges aur universities 10–31 March tak band</li>
                  <li>Online classes mandatory ho gayi hain — dono private aur government institutions ke liye</li>
                  <li>Grade 8 ke exams aur tamam board exams schedule par jari hain</li>
                  <li>Matric exams 27 March se shuru honge — schools band hone ke bawajood</li>
                  <li>Intermediate Part-I & II exams May 2026 mein hain</li>
                  <li>Faisla economic crisis aur fuel shortage ki wajah se liya gaya</li>
                </ul>
              </div>

              <p><strong>LAHORE:</strong> Punjab Education Minister <strong>Rana Sikandar Hayat</strong> ne ek ajeeb aur aiteraz-angez U-turn lete hue, sirf <strong>3 din ke andar</strong>, apna hi diya hua byan mukamal taur par wapis le liya. March 9 ko, Punjab ke tamam schools, colleges aur universities ko <strong>31 March 2026 tak band</strong> karne ka official hukam jari ho gaya — aur online classes lazmi qarar de di gayin.</p>

              <p>Yeh faisla lakhon students aur unke walidain ke liye ek bada jhatka sabit hua — khaaskar un students ke liye jo board exams ki intense tayyari mein masroof thay.</p>

              <h2>Pehle Kya Kaha Tha Minister Ne?</h2>
              <p>6 March 2026 ko, Rana Sikandar Hayat ne apne official X (Twitter) account se clearly likha tha ke schools bilkul band nahi ho rahe. Unho ne directly walidain ko social media ki afwaon ko nakar karne ki hidayat ki thi.</p>

              <blockquote>
                "Schools are open as per schedule. No closures and no online classes are planned. Parents, please ignore rumors."
                <cite>— Rana Sikandar Hayat, Official X (Twitter) Account, March 6, 2026</cite>
              </blockquote>

              <h2>Phir 3 Din Mein Kya Badla?</h2>
              <p>Pehle byan ke sirf <strong>72 ghante baad</strong>, 9 March 2026 ko naya hukam aaya. <strong>Punjab ke tamam sarkari aur private schools, colleges aur universities 31 March tak band</strong> karne ka faisla kiya gaya. Online mode mein shift lazmi qarar diya gaya.</p>

              <blockquote>
                "Punjab ke tamam schools, colleges aur universities 31 March tak online mode mein shift ho jaayengi. Sirf board exams muqarara schedule par hote rahenge."
                <cite>— Punjab Education Department Official Notification, March 9, 2026</cite>
              </blockquote>

              {/* CENTER HORIZONTAL AD */}
              <a className="ad-horizontal" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                <div className="ad-h-icon">📚</div>
                <div className="ad-h-text">
                  <span className="ad-label">📢 Apna Tuition — Sponsored</span>
                  <h3>School Band? Don't Stop Learning!</h3>
                  <p>Get verified home & online tutors from Apna Tuition for board exam preparation — Available across Lahore, Karachi, Islamabad, and all of Pakistan.</p>
                </div>
                <div className="ad-h-cta">Find a Tutor →</div>
              </a>

              <h2>School Closure Ki Wajah Kya Hai?</h2>
              <p>Hukumat ke mutabiq yeh faisla Pakistan ki <strong>ongoing economic crisis</strong> aur <strong>fuel supply disruption</strong> ki wajah se kiya gaya — jo Middle East mein jaari kasheedagi ke baad mazeed complicated ho gayi hai. Federal government ke "National Action Plan" mein energy conservation ke tahat schools ko online shift karna ek option tha — jise pehle Punjab ne radd kiya tha, lekin bad mein maanna pada.</p>

              <p>Critics ka kehna hai ke yeh U-turn hukumat ki planning ki kami ko zahir karta hai. Ek taraf board exams ka pressure, doosri taraf achanak schools band karne ka faisla — dono ko kaise manage kiya jaye yeh sawaal ab walidain aur students ke zehan mein hai.</p>

              <h2>Board Exams Ka Kya Hoga? — Official Schedule</h2>
              <p>Minister ne clearly confirm kiya hai ke <strong>board exams par bilkul koi asar nahi hoga</strong>. Tamam exams apne muqarara schedule par hote rahenge — chahe schools physically band hoon.</p>

              <table>
                <thead>
                  <tr><th>Event</th><th>Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  <tr><td>Punjab Schools / Colleges / Universities Band</td><td>10 March – 31 March 2026</td><td>🔴 Effective Now</td></tr>
                  <tr><td>Grade 8 Annual Exams</td><td>9 March 2026 (shuru ho gaye)</td><td>✅ Jari Hain</td></tr>
                  <tr><td>Matric Exams (Grade 9 & 10)</td><td>27 March 2026</td><td>✅ Schedule Par</td></tr>
                  <tr><td>College / University Exams</td><td>April Akhir 2026</td><td>✅ Schedule Par</td></tr>
                  <tr><td>Intermediate Part-I & II Exams</td><td>May 2026</td><td>✅ Schedule Par</td></tr>
                  <tr><td>O Level & A Level Exams</td><td>Intermediate ke baad</td><td>✅ Schedule Par</td></tr>
                </tbody>
              </table>

              <h2>Walidain Aur Students Ke Liye Mashwara</h2>
              <p>Yeh waqt confusion ka nahi, fauran action lene ka hai. Schools band hain, online classes shuru hain, aur board exams bhi sar par hain — yeh triple pressure pehle kum hi aaya hai. Online classes mein teachers ka individual attention mushkil hota hai aur bahut se students ghar par akele effectively padh nahi paate.</p>

              <p>Experts ka mashwara hai ke agar aapka bacha board exams ki tayyari mein peeche lag raha hai, toh <strong>ek qualified private home tutor ya online tuition service</strong> abhi sabse effective solution hai — kyunki tutor student ki specific zaroorat par 100% focus karta hai, jo online class mein mumkin nahi.</p>

              {/* BOTTOM HORIZONTAL AD */}
              <a className="ad-bottom" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                <span className="ad-label" style={{display:'block',marginBottom:'10px'}}>📢 Apna Tuition — Pakistan's Trusted Tuition Service</span>
                <h3>In Tough Times — Apna Tuition Is Here For You 🎓</h3>
                <p>Schools are closed, but board exams are coming. Book a <strong>qualified, verified Home or Online Tutor</strong> for your child today — affordable rates, available across Pakistan.</p>
                <div className="ad-bottom-features">
                  <span className="ad-feat">🏠 Home Tuition</span>
                  <span className="ad-feat">💻 Online Tuition</span>
                  <span className="ad-feat">📖 Matric · FSc · O Level · A Level</span>
                  <span className="ad-feat">✅ Verified Tutors</span>
                  <span className="ad-feat">📍 Lahore · Karachi · Islamabad · Rawalpindi</span>
                  <span className="ad-feat">💰 Affordable Rates</span>
                </div>
                <div className="ad-bottom-cta">🔍 Find Your Tutor Now — Apna Tuition →</div>
              </a>

              {/* Tags */}
              <div className="tags">
                <a href="#">Rana Sikandar Hayat</a>
                <a href="#">Rana Sikandar Hayat Statement</a>
                <a href="#">Punjab School Band</a>
                <a href="#">Punjab Schools Closed March 2026</a>
                <a href="#">Online Classes Punjab</a>
                <a href="#">School Closure Pakistan</a>
                <a href="#">Board Exams 2026</a>
                <a href="#">Matric Exams 2026</a>
                <a href="#">Intermediate Exams 2026</a>
                <a href="#">O Level A Level Pakistan</a>
                <a href="#">Punjab Education Minister</a>
                <a href="#">Pakistan Education News</a>
                <a href="#">Home Tutor Punjab</a>
                <a href="#">Online Tuition Pakistan</a>
                <a href="#">Apna Tuition</a>
                <a href="#">Punjab U-Turn Schools</a>
                <a href="#">Fuel Shortage Pakistan Schools</a>
              </div>

              <div className="sources">
                <strong>Sources & References:</strong><br/>
                <a href="https://www.geo.tv" target="_blank" rel="noopener noreferrer">Geo.tv</a> — Punjab schools closed till 31 March, online mode ordered &nbsp;|&nbsp;
                <a href="https://arynews.tv" target="_blank" rel="noopener noreferrer">ARY News</a> — Rana Sikandar Hayat reverses stance on school closures &nbsp;|&nbsp;
                <a href="https://www.thenews.com.pk" target="_blank" rel="noopener noreferrer">The News International</a> — Punjab school closure order March 2026 &nbsp;|&nbsp;
                <a href="https://propakistani.pk" target="_blank" rel="noopener noreferrer">ProPakistani</a> — Punjab minister's U-turn on schools &nbsp;|&nbsp;
                <a href="https://www.dawn.com" target="_blank" rel="noopener noreferrer">Dawn</a> — Punjab schools shift online until end of March
              </div>
            </main>

            {/* SIDEBAR */}
            <aside className="sidebar-col">
              <a className="ad-sidebar" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                <span className="ad-label">📢 Apna Tuition</span>
                <div className="ad-icon">🎓</div>
                <h3>Schools Closed?<br/>Don't Stop Learning!</h3>
                <p>Get board exam preparation at home with Apna Tuition's qualified tutors — home or online — across Pakistan.</p>
                <div className="ad-sidebar-features">
                  <div className="ad-sf">Home Tuition Available</div>
                  <div className="ad-sf">Online Tuition — All Pakistan</div>
                  <div className="ad-sf">Matric & FSc Experts</div>
                  <div className="ad-sf">O Level / A Level</div>
                  <div className="ad-sf">Affordable & Verified</div>
                  <div className="ad-sf">Lahore · Karachi · Islamabad</div>
                </div>
                <span className="ad-sidebar-cta">Find a Tutor →</span>
              </a>

              <div className="sidebar-trending">
                <h4>🔥 Trending Education News</h4>
                <div className="trending-item">
                  <div className="trending-num">1</div>
                  <div className="trending-title">Punjab Schools 31 March Tak Band — Official Order</div>
                </div>
                <div className="trending-item">
                  <div className="trending-num">2</div>
                  <div className="trending-title">Matric Exams 27 March Ko Shuru Honge — BISE Lahore</div>
                </div>
                <div className="trending-item">
                  <div className="trending-num">3</div>
                  <div className="trending-title">Intermediate Exams May 2026 — Schedule Jari</div>
                </div>
                <div className="trending-item">
                  <div className="trending-num">4</div>
                  <div className="trending-title">Online Tuition Demand Mein Record Izafa — March 2026</div>
                </div>
                <div className="trending-item">
                  <div className="trending-num">5</div>
                  <div className="trending-title">O Level & A Level Exams — Punjab Students Guide</div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <LandingFooter />
      </div>
    </>
  );
};

export default PunjabSchoolsArticle;
