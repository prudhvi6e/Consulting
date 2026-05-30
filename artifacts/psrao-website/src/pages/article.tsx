import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Play, Pause, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { getArticleBySlug, getArticlePlainText } from "@/data/articles";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import NotFound from "./not-found";
import { cn } from "@/lib/utils";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();

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

      // We need to wait for state to update, or just create audio directly
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
    if (summary) return; // Already summarized
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
    <div className="w-full pt-28 pb-24 bg-background relative overflow-hidden">
      {/* Background glowing meshes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <article className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
        <Link href="/insights" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group">
          <ArrowLeft className="mr-2 w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> Back to Insights
        </Link>

        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-primary mb-6">
            <span className="uppercase tracking-widest">{article.category}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-muted-foreground">{article.date}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-muted-foreground">{article.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-8 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                PR
              </div>
              <div>
                <p className="font-medium text-foreground">{article.author}</p>
                <p className="text-sm text-muted-foreground">{article.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full bg-background/50 backdrop-blur border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={handlePlayPause}
                disabled={isTtsLoading}
              >
                {isTtsLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isTtsLoading ? "Generating Audio..." : isPlaying ? "Pause Audio" : "Listen to Article"}
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                className="rounded-full shadow-[0_0_15px_rgba(46,107,255,0.3)] hover:shadow-[0_0_25px_rgba(46,107,255,0.5)] transition-all"
                onClick={handleSummarize}
                disabled={isSummaryLoading || !!summary}
              >
                {isSummaryLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {isSummaryLoading ? "Summarizing..." : summary ? "Summarized" : "AI Summary"}
              </Button>
            </div>
          </div>

          {/* Error States for AI */}
          <motion.div 
            initial={false}
            animate={{ height: (ttsError || summaryError) ? "auto" : 0, opacity: (ttsError || summaryError) ? 1 : 0 }}
            className="overflow-hidden"
          >
            {(ttsError || summaryError) && (
              <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm font-medium">
                  {ttsError && <p>Audio Error: {ttsError}</p>}
                  {summaryError && <p>Summary Error: {summaryError}</p>}
                </div>
              </div>
            )}
          </motion.div>

          {/* AI Summary Panel */}
          <motion.div
            initial={false}
            animate={{ height: summary ? "auto" : 0, opacity: summary ? 1 : 0, marginTop: summary ? 24 : 0 }}
            className="overflow-hidden"
          >
            {summary && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 relative backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400 opacity-50" />
                <div className="flex items-center gap-2 mb-4 text-primary font-medium">
                  <Sparkles className="w-5 h-5" /> Key Takeaways
                </div>
                <div className="space-y-2 text-foreground/90">
                  {(() => {
                    const bullets = summary
                      .split("\n")
                      .map((line) => line.trim())
                      .filter((line) => /^[-*]\s+/.test(line))
                      .map((line) => line.replace(/^[-*]\s+/, ""));
                    if (bullets.length > 0) {
                      return bullets.map((bullet, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <p className="leading-relaxed">{bullet}</p>
                        </div>
                      ));
                    }
                    return summary
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line, i) => (
                        <p key={i} className="leading-relaxed">
                          {line}
                        </p>
                      ));
                  })()}
                </div>
              </div>
            )}
          </motion.div>
        </header>

        <div className="prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed font-medium mb-10">
            {article.excerpt}
          </p>
          
          {article.content.map((section, idx) => (
            <div key={idx} className="mb-10">
              {section.heading && (
                <h2 className="text-2xl md:text-3xl mt-12 mb-6 text-foreground">{section.heading}</h2>
              )}
              {section.paragraphs.map((paragraph, pIdx) => (
                <p key={pIdx} className="mb-6 leading-relaxed text-foreground/80">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
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
