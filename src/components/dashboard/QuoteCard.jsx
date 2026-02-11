import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';
import Card from '../ui/Card';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do.", author: "Lou Holtz" },
  { text: "Consistency is more important than perfection.", author: "Unknown" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" }
];

const QuoteCard = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 overflow-hidden relative group">
      <div className="absolute -top-2 -left-2 text-primary/10 text-5xl group-hover:scale-110 transition-transform duration-500">
        <FaQuoteLeft />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={quote.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative z-10 py-4 px-6"
        >
          <p className="text-xl font-display font-medium italic text-slate-200 leading-relaxed">
            "{quote.text}"
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-px w-8 bg-primary/50" />
            <p className="text-primary font-semibold tracking-wide uppercase text-xs">
              {quote.author}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default QuoteCard;
