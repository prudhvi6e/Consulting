import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, Play, Pause, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { getArticleBySlug, getArticlePlainText } from "@/data/articles";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import NotFound from "./not-found";
import { Reveal } from "@/components/visual/Reveal";
import { Parallax } from "@/components/visual/Parallax";
import { TiltCard } from "@/components/visual/TiltCard";
import { cn } from "@/lib/utils";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const { toast } = useToast();

  // TTS State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Summary State
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Insights | PS Rao & Associates`;
    }
  }, [article]);

  useEffect(() => {
    // Cleanup audio URL on unmount
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  if (!article) return <NotFound />;

  const plainText = getArticlePlainText(article);

  const handlePlayPause = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (audioUrl) {
      audioRef.current?.play();
      setIsPlaying(true);
      return;
    }

    setIsTtsLoading(true);
    setTtsError(null);
    try {
      const textToSpeak = plainText.substring(0, 8000);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSpeak }),
      });

      if (!res.ok) {
        let errStr = "Failed to generate audio.";
        try {
          const errData = await res.json();
          if (errData.error) errStr = errData.error;
        } catch (e) {}
        throw new Error(errStr);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      if (!audioRef.current) {
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => setIsPlaying(false);
      } else {
        audioRef.current.src = url;
      }
      audioRef.current.play();
      setIsPlaying(true);
    } catch (err: any) {
      setTtsError(err.message || "An unexpected error occurred.");
      toast({
        title: "Audio Generation Failed",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsTtsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (summary) return;
    setIsSummaryLoading(true);
    setSummaryError(null);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: plainText, title: article.title }),
      });

      if (!res.ok) {
        let errStr = "Failed to generate summary.";
        try {
          const errData = await res.json();
          if (errData.error) errStr = errData.error;
        } catch (e) {}
        throw new Error(errStr);
      }

      const data = await res.json();
      const text = typeof data.summary === "string" ? data.summary.trim() : "";
      if (!text) {
        throw new Error("The AI returned an empty summary. Please try again.");
      }
      setSummary(text);
    } catch (err: any) {
      setSummaryError(err.message || "An unexpected error occurred.");
      toast({
        title: "Summarization Failed",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  return (
    <div className="w-full pt-32 pb-32 bg-transparent relative overflow-hidden">
      <Parallax offset={100} className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[60vw] max-h-[800px] bg-primary/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-aurora" />

      <article className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
        <Reveal>
          <Link href="/insights" className="inline-flex items-center h-10 px-6 rounded-full glass border border-white/10 text-sm font-bold text-foreground hover:text-primary transition-all mb-12 shadow-sm hover:shadow-md group">
            <ArrowLeft className="mr-2 w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> Back to Insights
          </Link>
        </Reveal>

        <header className="mb-16">
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-primary mb-8">
              <span className="uppercase tracking-widest">{article.category}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-muted-foreground">{article.date}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-muted-foreground">{article.readTime}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-12 leading-[1.1] drop-shadow-md tracking-tight">
              {article.title}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 p-8 rounded-[2rem] glass border border-white/10 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-display font-bold text-xl shadow-[0_0_15px_rgba(46,107,255,0.2)]">
                  PR
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground mb-1">{article.author}</p>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{article.authorRole}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full glass border-white/20 hover:bg-white/10 hover:text-primary transition-all shadow-md h-12 px-6 font-bold"
                  onClick={handlePlayPause}
                  disabled={isTtsLoading}
                >
                  {isTtsLoading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : isPlaying ? <Pause className="w-5 h-5 mr-3" /> : <Play className="w-5 h-5 mr-3" />}
                  {isTtsLoading ? "Generating..." : isPlaying ? "Pause Audio" : "Listen to Article"}
                </Button>
                
                <Button 
                  size="lg" 
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(46,107,255,0.4)] hover:shadow-[0_0_30px_rgba(46,107,255,0.6)] transition-all h-12 px-6 font-bold"
                  onClick={handleSummarize}
                  disabled={isSummaryLoading || !!summary}
                >
                  {isSummaryLoading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Sparkles className="w-5 h-5 mr-3" />}
                  {isSummaryLoading ? "Summarizing..." : summary ? "Summarized" : "AI Summary"}
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Error States for AI */}
          <div className={cn("overflow-hidden transition-all duration-300", (ttsError || summaryError) ? "h-auto mt-6 opacity-100" : "h-0 opacity-0")}>
            {(ttsError || summaryError) && (
              <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-4 text-destructive backdrop-blur-md shadow-lg">
                <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                <div className="text-base font-medium">
                  {ttsError && <p>Audio Error: {ttsError}</p>}
                  {summaryError && <p>Summary Error: {summaryError}</p>}
                </div>
              </div>
            )}
          </div>

          {/* AI Summary Panel */}
          <div className={cn("overflow-hidden transition-all duration-500 ease-out", summary ? "h-auto mt-10 opacity-100" : "h-0 opacity-0")}>
            {summary && (
              <TiltCard glow={true}>
                <div className="p-8 md:p-10 rounded-[2.5rem] glass border border-primary/30 relative shadow-[0_10px_40px_rgba(46,107,255,0.15)]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-transparent opacity-50" />
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[50px] rounded-full pointer-events-none mix-blend-screen" />
                  
                  <div className="flex items-center gap-3 mb-8 text-primary font-bold text-xl drop-shadow-md">
                    <Sparkles className="w-6 h-6" /> Key Takeaways
                  </div>
                  <div className="space-y-4 text-foreground/90 text-lg font-light relative z-10">
                    {(() => {
                      const bullets = summary
                        .split("\n")
                        .map((line) => line.trim())
                        .filter((line) => /^[-*]\s+/.test(line))
                        .map((line) => line.replace(/^[-*]\s+/, ""));
                      if (bullets.length > 0) {
                        return bullets.map((bullet, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0 shadow-[0_0_8px_rgba(46,107,255,0.8)]" />
                            <p className="leading-relaxed">{bullet}</p>
                          </div>
                        ));
                      }
                      return summary
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line, i) => (
                          <p key={i} className="leading-relaxed p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                            {line}
                          </p>
                        ));
                    })()}
                  </div>
                </div>
              </TiltCard>
            )}
          </div>
        </header>

        <Reveal delay={0.3}>
          <div className="prose prose-xl dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none glass-panel p-10 md:p-16 rounded-[3rem] shadow-2xl border-white/10">
            <p className="text-2xl text-foreground/90 leading-relaxed font-medium mb-12 border-l-4 border-primary pl-6 py-2">
              {article.excerpt}
            </p>
            
            {article.content.map((section, idx) => (
              <div key={idx} className="mb-12">
                {section.heading && (
                  <h2 className="text-3xl md:text-4xl mt-16 mb-8 text-foreground drop-shadow-sm">{section.heading}</h2>
                )}
                {section.paragraphs.map((paragraph, pIdx) => (
                  <p key={pIdx} className="mb-8 leading-relaxed text-foreground/80 font-light">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </article>
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
}