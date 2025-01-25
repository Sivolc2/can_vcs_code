# ZRC (Zeroith Round Capital) Bot 🤖💰

An AI-powered VC that roasts your startup dreams with maximum snark and minimum mercy.

## Features

- 🎯 Startup pitch analysis with brutal honesty
- 😂 Meme generation for maximum social media impact
- 🗣️ Gordon Ramsay-style voice roasts
- 📄 Hilarious term sheet generation
- 🎭 Multiple roast modes (from mild snark to full chaos)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zrc-bot.git
cd zrc-bot
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with your API keys:
```env
CLAUDE_API_KEY=your_anthropic_key
ELEVENLABS_API_KEY=your_elevenlabs_key
TWITTER_API_KEY=your_twitter_key
TWITTER_API_SECRET=your_twitter_secret
```

4. Run the server:
```bash
uvicorn zrc.api:app --reload
```

## Usage

### API Endpoints

1. Analyze a Pitch
```bash
curl -X POST "http://localhost:8000/analyze_pitch" \
     -H "Content-Type: application/json" \
     -d '{"pitch": "We're building Uber for NFTs", "mode": "chaos"}'
```

2. Generate Term Sheet
```bash
curl -X POST "http://localhost:8000/generate_term_sheet" \
     -H "Content-Type: application/json" \
     -d '{"valuation": 42.0}'
```

3. Get Available Roast Modes
```bash
curl "http://localhost:8000/roast_modes"
```

### Roast Modes

- `basic`: Mild snark (for sensitive VCs)
- `chaos`: Full Reddit-tier trolling
- `therapy`: Passive-aggressive compliments

## Contributing

Feel free to contribute more roasts, meme templates, or features! Just remember:
1. Keep it funny but not mean
2. Add tests for new features
3. Follow the existing code style

## License

MIT License - Feel free to use this to crush startup dreams responsibly.