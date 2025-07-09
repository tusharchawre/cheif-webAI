import { FileSystemTree } from "@webcontainer/api";

/**
 * Helper function to recursively add a file with its content to the FileSystemTree.
 * It creates directory objects as needed based on the file path.
 *
 * @param {import('@webcontainer/api').FileSystemTree} tree The current level of the FileSystemTree being built.
 * @param {string} path The full path to the file (e.g., "src/components/Header.tsx").
 * @param {string} contents The content of the file.
 */
function addFileToTree(tree: FileSystemTree, path: string, contents: string) {
  const parts = path.split("/"); // Split the path into directory/file names
  let current: any = tree; // Start at the root of the tree

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (i === parts.length - 1) {
      // If this is the last part, it's the file name
      current[part] = {
        file: {
          contents: contents, // Assign the file content
        },
      };
    } else {
      // If not the last part, it's a directory
      if (!current[part]) {
        // If the directory doesn't exist, create it
        current[part] = {
          directory: {},
        };
      }
      // Move deeper into the directory structure
      current = current[part].directory;
    }
  }
}

/**
 * A parser designed to incrementally process a stream of AI responses
 * containing CheifAction XML-like structures and build a WebContainer FileSystemTree.
 */
export class CheifArtifactStreamParser {
  private xmlBuffer: string;
  private files: FileSystemTree;
  private readonly regex: RegExp;

  constructor() {
    this.xmlBuffer = "";
    this.files = {};
    // Regex to capture the filePath and the content within each CheifAction tag.
    // 's' flag: allows '.' to match newline characters.
    // 'g' flag: global, finds all matches. Used with `matchAll`.
    this.regex =
      /<CheifAction type="file" filePath="([^"]+)">([\s\S]*?)<\/CheifAction>/gs;
  }

  /**
   * Appends a new chunk of the AI response to the internal buffer and processes
   * any complete CheifAction tags found.
   *
   * @param {string} newChunk The new string chunk received from the AI response stream.
   * @returns {import('@webcontainer/api').FileSystemTree} The current state of the FileSystemTree, updated with any newly parsed files.
   */
  public processChunk(newChunk: string): FileSystemTree {
    this.xmlBuffer += newChunk;

    let lastConsumedIndex = 0;
    const matches = Array.from(this.xmlBuffer.matchAll(this.regex));

    for (const match of matches) {
      // Ensure the match object and its required properties exist
      if (match.index !== undefined && match[0] && match[1] && match[2]) {
        const filePath = match[1];
        const fileContents = match[2].trim();

        // Add the extracted file to our nested 'files' object
        addFileToTree(this.files, filePath, fileContents);

        // Update the index indicating how much of the buffer has been successfully parsed.
        // We take the maximum to ensure we account for non-overlapping matches.
        lastConsumedIndex = Math.max(
          lastConsumedIndex,
          match.index + match[0].length,
        );
      }
    }

    // Retain only the unparsed part of the buffer for the next chunk.
    // This handles cases where a tag is incomplete at the end of the current buffer.
    this.xmlBuffer = this.xmlBuffer.substring(lastConsumedIndex);

    return this.files;
  }

  /**
   * Returns the current state of the FileSystemTree. This is useful
   * after the entire stream has been processed to get the final result.
   * @returns {import('@webcontainer/api').FileSystemTree} The complete FileSystemTree object.
   */
  public getFiles(): FileSystemTree {
    return this.files;
  }

  /**
   * Resets the parser's internal state (buffer and file tree) for a new parsing session.
   * Call this when you start processing a completely new AI response.
   */
  public reset(): void {
    this.xmlBuffer = "";
    this.files = {};
  }
}

// The original, non-streaming parser can still be used for complete responses:
export function parseCheifArtifactToWebcontainerFiles(aiResponseObject: any) {
  const parser = new CheifArtifactStreamParser();
  parser.processChunk(aiResponseObject.response); // Process the entire response as one chunk
  return parser.getFiles();
}

// Assume 'aiResponse' is the full object from your example, for mocking purposes.
const aiResponse = {
  response: `Of course. Let's design a beautiful, production-worthy landing page for a modern furniture store.
    
    We'll craft a visually stunning and fully-featured homepage that's ready to impress customers.
    
    <CheifArtifact id=\"furniture-store-landing-page\" title=\"Furniture Store Landing Page\">
      <CheifAction type=\"file\" filePath=\"index.html\">
        <!doctype html>
        <html lang=\"en\">
          <head>
            <meta charset=\"UTF-8\" />
            <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />
            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
            <title>Furnish. - Modern Furniture & Decor</title>
          </head>
          <body>
            <div id=\"root\"></div>
            <script type=\"module\" src=\"/src/main.tsx\"></script>
          </body>
        </html>
      </CheifAction>
      <CheifAction type=\"file\" filePath=\"src/App.tsx\">
        import React from 'react';
        import Header from './components/Header';
        import Hero from './components/Hero';
        import FeaturedProducts from './components/FeaturedProducts';
        import WhyChooseUs from './components/WhyChooseUs';
        import Testimonials from './components/Testimonials';
        import Newsletter from './components/Newsletter';
        import Footer from './components/Footer';
    
        function App() {
          return (
            <div className=\"bg-white text-gray-800 antialiased\">
              <Header />
              <main>
                <Hero />
                <FeaturedProducts />
                <WhyChooseUs />
                <Testimonials />
                <Newsletter />
              </main>
              <Footer />
            </div>
          );
        }
    
        export default App;
      </CheifAction>
      <CheifAction type=\"file\" filePath=\"src/components/FeaturedProducts.tsx\">
        import React from 'react';
        import { ShoppingCart } from 'lucide-react';
    
        const products = [
          {
            name: 'Nordic Lounge Chair',
            price: '$450',
            image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1964&auto=format&fit=crop',
            category: 'Chairs',
          },
          {
            name: 'Modern Oak Table',
            price: '$750',
            image: 'https://images.unsplash.com/photo-1604074131652-a1855c28fd93?q=80&w=1887&auto=format&fit=crop',
            category: 'Tables',
          },
          {
            name: 'Sleek Velvet Sofa',
            price: '$1250',
            image: 'https://images.unsplash.com/photo-1540574163024-58ea3f3b1b58?q=80&w=1887&auto=format&fit=crop',
            category: 'Sofas',
          },
          {
            name: 'Minimalist Wall Lamp',
            price: '$180',
            image: 'https://images.unsplash.com/photo-1594215744214-e51c82830f5b?q=80&w=1887&auto=format&fit=crop',
            category: 'Lighting',
          },
        ];
    
        function FeaturedProducts() {
          return (
            <section className=\"py-20 px-4 sm:px-6 lg:px-8 bg-gray-50\">
              <div className=\"max-w-7xl mx-auto\">
                <div className=\"text-center\">
                  <h2 className=\"text-3xl font-extrabold tracking-tight sm:text-4xl\">
                    Our Featured Collection
                  </h2>
                  <p className=\"mt-4 max-w-2xl mx-auto text-lg text-gray-500\">
                    Handpicked pieces that blend form, function, and unparalleled craftsmanship.
                  </p>
                </div>
                <div className=\"mt-12 grid gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8\">
                  {products.map((product) => (
                    <div key={product.name} className=\"group relative\">
                      <div className=\"relative w-full h-72 rounded-lg overflow-hidden bg-gray-200\">
                        <img
                          src={product.image}
                          alt={product.name}
                          className=\"w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity\"
                        />
                      </div>
                      <div className=\"mt-4 flex justify-between\">
                        <div>
                          <h3 className=\"text-sm text-gray-700\">
                            <a href=\"#\">
                              <span aria-hidden=\"true\" className=\"absolute inset-0\" />
                              {product.name}
                            </a>
                          </h3>
                          <p className=\"mt-1 text-sm text-gray-500\">{product.category}</p>
                        </div>
                        <p className=\"text-sm font-medium text-gray-900\">{product.price}</p>
                      </div>
                      <button className=\"mt-4 w-full bg-gray-800 text-white py-2 px-4 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity\">
                        <ShoppingCart className=\"w-4 h-4 mr-2\" />
                        Add to cart
                      </button>
                    </div>
                  ))}\n            </div>\n          </div>\n        </section>\n      );\n    }\n\n    export default FeaturedProducts;\n  </CheifAction>\n  <CheifAction type=\"file\" filePath=\"src/components/Footer.tsx\">\n    import React from 'react';\n    import { Sofa, Twitter, Instagram, Facebook } from 'lucide-react';\n\n    function Footer() {\n      return (\n        <footer className=\"bg-gray-900 text-white\">\n          <div className=\"max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8\">\n            <div className=\"xl:grid xl:grid-cols-3 xl:gap-8\">\n              <div className=\"space-y-8 xl:col-span-1\">\n                 <a href=\"#\" className=\"flex items-center space-x-2\">\n                  <Sofa className=\"h-8 w-auto text-indigo-400\" />\n                  <span className=\"text-2xl font-bold\">Furnish.</span>\n                </a>\n                <p className=\"text-gray-400 text-base\">\n                  Crafting spaces, inspiring life. The finest furniture for the modern home.\n                </p>\n                <div className=\"flex space-x-6\">\n                  <a href=\"#\" className=\"text-gray-400 hover:text-indigo-400\">\n                    <span className=\"sr-only\">Facebook</span>\n                    <Facebook className=\"h-6 w-6\" />\n                  </a>\n                  <a href=\"#\" className=\"text-gray-400 hover:text-indigo-400\">\n                    <span className=\"sr-only\">Instagram</span>\n                    <Instagram className=\"h-6 w-6\" />\n                  </a>\n                  <a href=\"#\" className=\"text-gray-400 hover:text-indigo-400\">\n                    <span className=\"sr-only\">Twitter</span>\n                    <Twitter className=\"h-6 w-6\" />\n                  </a>\n                </div>\n              </div>\n              <div className=\"mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2\">\n                <div className=\"md:grid md:grid-cols-2 md:gap-8\">\n                  <div>\n                    <h3 className=\"text-sm font-semibold text-gray-400 tracking-wider uppercase\">Solutions</h3>\n                    <ul className=\"mt-4 space-y-4\">\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Marketing</a></li>\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Analytics</a></li>\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Commerce</a></li>\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Insights</a></li>\n                    </ul>\n                  </div>\n                  <div className=\"mt-12 md:mt-0\">\n                    <h3 className=\"text-sm font-semibold text-gray-400 tracking-wider uppercase\">Support</h3>\n                    <ul className=\"mt-4 space-y-4\">\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Pricing</a></li>\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Documentation</a></li>\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Guides</a></li>\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">API Status</a></li>\n                    </ul>\n                  </div>\n                </div>\n                <div className=\"md:grid md:grid-cols-2 md:gap-8\">\n                  <div>\n                    <h3 className=\"text-sm font-semibold text-gray-400 tracking-wider uppercase\">Company</h3>\n                    <ul className=\"mt-4 space-y-4\">\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">About</a></li>\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Blog</a></li>\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Jobs</a></li>\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Press</a></li>\n                    </ul>\n                  </div>
                    <div className=\"mt-12 md:mt-0\">\n                    <h3 className=\"text-sm font-semibold text-gray-400 tracking-wider uppercase\">Legal</h3>\n                    <ul className=\"mt-4 space-y-4\">\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Claim</a></li>\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Privacy</a></li>\n                      <li><a href=\"#\" className=\"text-base text-gray-300 hover:text-white\">Terms</a></li>\n                    </ul>\n                  </div>\n                </div>\n              </div>\n            </div>\n            <div className=\"mt-12 border-t border-gray-700 pt-8\">\n              <p className=\"text-base text-gray-400 xl:text-center\">&copy; 2024 Furnish., Inc. All rights reserved.</p>\n            </div>\n          </div>\n        </footer>\n      );\n    }\n\n    export default Footer;\n  </CheifAction>\n  <CheifAction type=\"file\" filePath=\"src/components/Header.tsx\">\n    import React, { useState } from 'react';\n    import { Sofa, Menu, X } from 'lucide-react';\n\n    function Header() {\n      const [isOpen, setIsOpen] = useState(false);\n\n      const navLinks = [\"Shop\", \"About\", \"Contact\"];\n\n      return (\n        <header className=\"bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50\">\n          <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">\n            <div className=\"flex justify-between items-center h-16\">\n              <div className=\"flex-shrink-0\">\n                <a href=\"#\" className=\"flex items-center space-x-2\">\n                  <Sofa className=\"h-8 w-auto text-indigo-600\" />\n                  <span className=\"text-2xl font-bold text-gray-900\">Furnish.</span>\n                </a>\n              </div>\n              <nav className=\"hidden md:flex md:items-center md:space-x-8\">\n                {navLinks.map(link => (\n                  <a key={link} href=\"#\" className=\"text-gray-600 hover:text-indigo-600 transition\">\n                    {link}\n                  </a>\n                ))}\n              </nav>\n              <div className=\"hidden md:flex items-center space-x-4\">\n                <a href=\"#\" className=\"text-gray-600 hover:text-indigo-600 transition\">\n                  Sign in\n                </a>\n                <a\n                  href=\"#\"\n                  className=\"bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition\"\n                >\n                  Sign up\n                </a>\n              </div>\n              <div className=\"md:hidden flex items-center\">\n                 <button onClick={() => setIsOpen(!isOpen)} className=\"inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500\">\n                    {isOpen ? <X className=\"h-6 w-6\" /> : <Menu className=\"h-6 w-6\" />}\n                 </button>\n              </div>\n            </div>\n          </div>\n           {isOpen && (\n                <div className=\"md:hidden\">\n                    <div className=\"px-2 pt-2 pb-3 space-y-1 sm:px-3\">\n                        {navLinks.map(link => (\n                          <a key={link} href=\"#\" className=\"text-gray-600 hover:bg-gray-50 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium\">\n                            {link}\n                          </a>\n                        ))}\n                    </div>\n                    <div className=\"pt-4 pb-3 border-t border-gray-200\">\n                        <div className=\"flex items-center px-5\">\n                            <div className=\"space-y-1\">\n                                <a href=\"#\" className=\"block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100\">Sign in</a>\n                                <a href=\"#\" className=\"block w-full text-left bg-indigo-600 text-white mx-3 mt-2 px-4 py-2 rounded-md hover:bg-indigo-700 transition\">Sign up</a>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            )}\n        </header>\n      );\n    }\n\n    export default Header;\n  </CheifAction>\n  <CheifAction type=\"file\" filePath=\"src/components/Hero.tsx\">\n    import React from 'react';\n    import { ArrowRight } from 'lucide-react';\n\n    function Hero() {\n      return (\n        <div className=\"relative bg-gray-900\">\n          <div className=\"absolute inset-0\">\n            <img\n              className=\"w-full h-full object-cover\"\n              src=\"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop\"\n              alt=\"Stylish modern living room\"\n            />\n            <div className=\"absolute inset-0 bg-gray-900/60\" aria-hidden=\"true\" />\n          </div>\n          <div className=\"relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center\">\n            <h1 className=\"text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl\">\n              Design Your Comfort Zone\n            </h1>\n            <p className=\"mt-6 max-w-2xl mx-auto text-xl text-gray-300\">\n              Discover artisanal furniture that brings style, comfort, and personality to your home.\n            </p>\n            <div className=\"mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center\">\n              <div className=\"space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5\">\n                <a\n                  href=\"#\"\n                  className=\"flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8\"\n                >\n                  Shop New Arrivals\n                </a>\n                <a\n                  href=\"#\"\n                  className=\"flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8\"\n                >\n                  Explore Collections <ArrowRight className=\"ml-2 h-5 w-5\" />\n                </a>\n              </div>\n            </div>\n          </div>\n        </div>\n      );\n    }\n\n    export default Hero;\n  </CheifAction>\n  <CheifAction type=\"file\" filePath=\"src/components/Newsletter.tsx\">\n    import React from 'react';\n    import { Mail } from 'lucide-react';\n\n    function Newsletter() {\n      return (\n        <div className=\"bg-indigo-700\">\n          <div className=\"max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between\">\n            <div className=\"lg:w-0 lg:flex-1\">\n              <h2 className=\"text-3xl font-extrabold tracking-tight text-white sm:text-4xl\">\n                Join Our Design Club\n              </h2>\n              <p className=\"mt-3 max-w-3xl text-lg leading-6 text-indigo-200\">\n                Get exclusive offers, design tips, and a first look at new collections delivered to your inbox.\n              </p>\n            </div>\n            <div className=\"mt-8 lg:mt-0 lg:ml-8\">\n              <form className=\"sm:flex\">\n                <label htmlFor=\"email-address\" className=\"sr-only\">\n                  Email address\n                </label>\n                <input\n                  id=\"email-address\"\n                  name=\"email-address\"\n                  type=\"email\"\n                  autoComplete=\"email\"\n                  required\n                  className=\"w-full px-5 py-3 border border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md\"\n                  placeholder=\"Enter your email\"\n                />\n                <div className=\"mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0\">\n                  <button\n                    type=\"submit\"\n                    className=\"w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-indigo-500\"\n                  >\n                    <Mail className=\"mr-2 h-5 w-5\" />\n                    Subscribe\n                  </button>\n                </div>\n              </form>\n            </div>\n          </div>\n        </div>\n      );\n    }\n\n    export default Newsletter;\n  </CheifAction>\n  <CheifAction type=\"file\"filePath=\"src/components/Testimonials.tsx\">\n    import React from 'react';\n    import { Star } from 'lucide-react';\n\n    const testimonials = [\n      {\n        quote: \"The quality is outstanding, and the design is exactly what I was looking for. My living room has been completely transformed. Absolutely in love with my new sofa!\",\n        author: 'Sarah L.',\n        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',\n      },\n      {\n        quote: \"From ordering to delivery, the process was seamless. The assembly was straightforward, and the customer service team was incredibly helpful. Highly recommended!\",\n        author: 'Michael B.',\n        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop',\n      },\n      {\n        quote: \"I was hesitant to buy furniture online, but Furnish. exceeded all my expectations. The armchair is even more beautiful in person. It's the perfect statement piece.\",\n        author: 'Jessica P.',\n        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',\n      }\n    ];\n\n    function Testimonials() {\n      return (\n        <section className=\"bg-white py-20 px-4 sm:px-6 lg:px-8\">\n          <div className=\"max-w-7xl mx-auto text-center\">\n            <h2 className=\"text-3xl font-extrabold tracking-tight sm:text-4xl\">What Our Customers Say</h2>\n            <p className=\"mt-4 max-w-2xl mx-auto text-lg text-gray-500\">\n              We're built on trust, quality, and the happiness of the homes we help create.\n            </p>\n            <div className=\"mt-12 grid gap-8 lg:grid-cols-3\">\n              {testimonials.map((testimonial) => (\n                <div key={testimonial.author} className=\"bg-gray-50 p-8 rounded-lg shadow-sm\">\n                  <div className=\"flex justify-center mb-4\">\n                     {[...Array(5)].map((_, i) => (\n                        <Star key={i} className=\"h-5 w-5 text-yellow-400 fill-current\" />\n                     ))}\n                  </div>\n                  <blockquote className=\"text-gray-600 italic\">\"{testimonial.quote}\"</blockquote>\n                  <div className=\"mt-6 flex items-center justify-center\">\n                    <img className=\"h-12 w-12 rounded-full object-cover\" src={testimonial.avatar} alt={testimonial.author} />\n                    <p className=\"ml-4 font-semibold text-gray-900\">{testimonial.author}</p>\n                  </div>\n                </div>\n              ))}\n            </div>\n          </div>\n        </section>\n      );\n    }\n\n    export default Testimonials;\n  </CheifAction>\n  <CheifAction type=\"file\" filePath=\"src/components/WhyChooseUs.tsx\">\n    import React from 'react';\n    import { ShieldCheck, Leaf, Feather, Award } from 'lucide-react';\n\n    const features = [\n      {\n        name: 'Unmatched Quality',\n        description: 'We use premium materials to ensure every piece is durable, comfortable, and built to last for generations.',\n        icon: ShieldCheck,\n      },\n      {\n        name: 'Sustainable Materials',\n        description: 'Responsibly sourced wood and eco-friendly fabrics that are kind to your home and the planet.',\n        icon: Leaf,\n      },\n      {\n        name: 'Timeless Design',\n        description: 'Our collections are curated by expert designers to bring you styles that are both modern and timeless.',\n        icon: Feather,\n      },\n       {\n        name: 'Artisanal Craftsmanship',\n        description: 'Each piece is meticulously crafted by skilled artisans who pour their passion and expertise into their work.',\n        icon: Award,\n      },\n    ];\n\n    function WhyChooseUs() {\n      return (\n        <div className=\"bg-white py-24 sm:py-32\">\n          <div className=\"max-w-7xl mx-auto px-6 lg:px-8\">\n            <div className=\"max-w-2xl mx-auto lg:text-center\">\n              <h2 className=\"text-base font-semibold leading-7 text-indigo-600\">Crafted with Care</h2>\n              <p className=\"mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl\">\n                Designed for Life\n              </p>\n              <p className=\"mt-6 text-lg leading-8 text-gray-600\">\n                We believe furniture should be more than functional. It should tell a story, inspire creativity, and be a source of comfort and joy.\n              </p>\n            </div>\n            <div className=\"max-w-2xl mx-auto mt-16 sm:mt-20 lg:mt-24 lg:max-w-none\">\n              <dl className=\"grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2\">\n                {features.map((feature) => (\n                  <div key={feature.name} className=\"flex flex-col\">\n                    <dt className=\"flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900\">\n                      <feature.icon className=\"h-5 w-5 flex-none text-indigo-600\" aria-hidden=\"true\" />\n                      {feature.name}\n                    </dt>\n                    <dd className=\"mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600\">\n                      <p className=\"flex-auto\">{feature.description}</p>\n                    </dd>\n                  </div>\n                ))}\n              </dl>\n            </div>\n          </div>\n        </div>\n      );\n    }\n    \n    export default WhyChooseUs;\n  </CheifAction>\n</CheifArtifact>`,
};

// --- Example Usage with a Mock Stream ---
async function processAIResponseStream(responseContent: string) {
  const parser = new CheifArtifactStreamParser();
  let webcontainerFiles: FileSystemTree = {};

  // Simulate an AI response streaming chunk by chunk
  const chunkSize = 500; // Adjust for smaller/larger chunks
  for (let i = 0; i < responseContent.length; i += chunkSize) {
    const chunk = responseContent.substring(i, i + chunkSize);
    console.log(`--- Processing Chunk ${Math.floor(i / chunkSize) + 1} ---`);
    webcontainerFiles = parser.processChunk(chunk);

    // At this point, 'webcontainerFiles' contains all *complete* files parsed so far.
    // You could update a UI, or perform other actions based on the current state.
    console.log(
      "Files parsed so far (keys only):",
      Object.keys(webcontainerFiles),
    );
    // For a deeper look, uncomment:
    // console.log(JSON.stringify(webcontainerFiles, null, 2));

    await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate network delay
  }

  // After the stream ends, get the final complete FileSystemTree
  webcontainerFiles = parser.getFiles();
  console.log("\n--- Final WebContainer Files ---");
  console.log(JSON.stringify(webcontainerFiles, null, 2));

  // Now you can use webcontainerFiles with WebContainer.mount()
  // await webcontainerInstance.mount(webcontainerFiles);
}

// To run the mock example:
processAIResponseStream(aiResponse.response);
