
import StoryGame from '@/components/games/story/StoryGame';

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 bg-[url('/assets/images/story-bg.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative">
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl">
        <StoryGame />
      </div>
    </main>
  );
}
