import {
  Shield,
  Lock,
  Zap,
  Globe,
  Hash,
  CheckCircle,
  Sparkles,
  FileVideo,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion } from 'framer-motion';

export function DocsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 mb-6">
            <Sparkles className="w-5 h-5 text-[#C6A0F6]" />
            <span
              className="text-[#16213E]"
              style={{ fontSize: '0.9375rem', fontWeight: 600 }}
            >
              Documentation
            </span>
          </div>
          <h1
            className="text-[#16213E] mb-4"
            style={{
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            How VeriVid Works
          </h1>
          <p
            className="text-[#16213E]/70 max-w-2xl mx-auto"
            style={{ fontSize: '1.0625rem', lineHeight: 1.6 }}
          >
            Blockchain technology meets creative protection
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="how" className="w-full">
            <TabsList className="glass-strong h-14 p-2 mb-10 grid w-full grid-cols-3 max-w-xl mx-auto">
              <TabsTrigger
                value="how"
                className="h-10 data-[state=active]:bg-white/80 data-[state=active]:shadow-lg rounded-xl"
                style={{ fontSize: '0.9375rem', fontWeight: 600 }}
              >
                How It Works
              </TabsTrigger>
              <TabsTrigger
                value="tech"
                className="h-10 data-[state=active]:bg-white/80 data-[state=active]:shadow-lg rounded-xl"
                style={{ fontSize: '0.9375rem', fontWeight: 600 }}
              >
                Technology
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="h-10 data-[state=active]:bg-white/80 data-[state=active]:shadow-lg rounded-xl"
                style={{ fontSize: '0.9375rem', fontWeight: 600 }}
              >
                FAQ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="how" className="space-y-6">
              {[
                {
                  icon: FileVideo,
                  title: 'Upload Your Video',
                  description:
                    'Start by uploading your original video content. Your file is processed locally and never leaves your control.',
                  details: [
                    'Files are processed in your browser',
                    'No video data is uploaded to servers',
                    'Complete privacy and security',
                  ],
                },
                {
                  icon: Hash,
                  title: 'Generate Unique Fingerprint',
                  description:
                    'We create a cryptographic hash—a unique digital fingerprint of your video that cannot be reversed.',
                  details: [
                    'SHA-256 cryptographic algorithm',
                    'Completely unique to your file',
                    'Any change creates a different hash',
                  ],
                },
                {
                  icon: Shield,
                  title: 'Record on Blockchain',
                  description:
                    'The hash, along with your wallet address and metadata, is permanently recorded on the blockchain.',
                  details: [
                    'Stored on Ethereum/Polygon networks',
                    'Immutable and tamper-proof',
                    'Timestamped with block time',
                  ],
                },
                {
                  icon: CheckCircle,
                  title: 'Receive Your Certificate',
                  description:
                    'Get your official certificate of authenticity. Anyone can verify it, but no one can alter it.',
                  details: [
                    'Shareable proof of ownership',
                    'Verifiable by anyone, anywhere',
                    'Valid forever on the blockchain',
                  ],
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0">
                      <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center shadow-lg">
                        <step.icon
                          className="w-7 h-7 text-[#16213E]"
                          strokeWidth={2}
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-[#A7E6FF] flex items-center justify-center shadow-lg">
                          <span
                            className="text-[#16213E]"
                            style={{ fontSize: '0.75rem', fontWeight: 800 }}
                          >
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-[#16213E] mb-2"
                        style={{ fontSize: '1.125rem', fontWeight: 700 }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="text-[#16213E]/70 mb-4"
                        style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}
                      >
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-[#16213E]/60"
                            style={{ fontSize: '0.875rem' }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A7E6FF]"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="tech" className="space-y-6">
              <div className="glass-card rounded-2xl p-8 mb-6">
                <h2
                  className="text-[#16213E] mb-6 text-center"
                  style={{ fontSize: '1.5rem', fontWeight: 800 }}
                >
                  Built on Blockchain
                </h2>
                <p
                  className="text-[#16213E]/70 text-center mb-8 max-w-2xl mx-auto"
                  style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}
                >
                  VeriVid leverages blockchain technology to provide unbreakable
                  proof of ownership
                </p>

                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    {
                      icon: Hash,
                      title: 'Cryptographic Hashing',
                      description:
                        'SHA-256 creates a unique fingerprint of your video. This one-way function ensures your content remains private while proving authenticity.',
                    },
                    {
                      icon: Shield,
                      title: 'Smart Contracts',
                      description:
                        'Automated contracts on Ethereum/Polygon handle verification. Once deployed, they execute exactly as programmed.',
                    },
                    {
                      icon: Globe,
                      title: 'Decentralized Storage',
                      description:
                        'Your verification data lives across thousands of nodes worldwide. No single point of failure.',
                    },
                    {
                      icon: Lock,
                      title: 'Zero-Knowledge Proofs',
                      description:
                        'Prove ownership without revealing the content. The blockchain stores proof, not the video itself.',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#A7E6FF]/30 to-[#C6A0F6]/30 flex items-center justify-center">
                          <item.icon
                            className="w-5 h-5 text-[#16213E]"
                            strokeWidth={2}
                          />
                        </div>
                        <h3
                          className="text-[#16213E]"
                          style={{ fontSize: '1rem', fontWeight: 700 }}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <p
                        className="text-[#16213E]/70"
                        style={{ fontSize: '0.875rem', lineHeight: 1.6 }}
                      >
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center mx-auto mb-4">
                    <Shield
                      className="w-6 h-6 text-[#16213E]"
                      strokeWidth={2}
                    />
                  </div>
                  <div
                    className="text-[#16213E] mb-1"
                    style={{ fontSize: '1.125rem', fontWeight: 700 }}
                  >
                    Ethereum
                  </div>
                  <p
                    className="text-[#16213E]/60"
                    style={{ fontSize: '0.875rem' }}
                  >
                    Maximum security and decentralization
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C6A0F6] to-[#A7E6FF] flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-[#16213E]" strokeWidth={2} />
                  </div>
                  <div
                    className="text-[#16213E] mb-1"
                    style={{ fontSize: '1.125rem', fontWeight: 700 }}
                  >
                    Polygon
                  </div>
                  <p
                    className="text-[#16213E]/60"
                    style={{ fontSize: '0.875rem' }}
                  >
                    Fast transactions and low fees
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-4">
              {[
                {
                  q: 'What exactly gets stored on the blockchain?',
                  a: 'Only a cryptographic hash (unique fingerprint) of your video, your wallet address, timestamp, and metadata like title. The actual video file never touches the blockchain—it stays private with you.',
                },
                {
                  q: 'Can someone steal my content if they see my certificate?',
                  a: 'No. The certificate only proves that YOU verified the content at a specific time. The hash cannot be reversed to recreate your video.',
                },
                {
                  q: 'What if someone verifies my video before me?',
                  a: 'The blockchain timestamp proves who verified first. If someone uploads your content before you, you can submit a dispute with evidence. The best protection is to verify immediately after creating content.',
                },
                {
                  q: 'How much does it cost?',
                  a: 'You only pay blockchain gas fees, which vary based on network congestion. Typical cost is $5-20 on Ethereum, or under $1 on Polygon. VeriVid takes no additional fees.',
                },
                {
                  q: 'Is my video uploaded to your servers?',
                  a: 'Never. The hash is generated locally in your browser. We never see, store, or have access to your actual video file. Your content remains 100% private.',
                },
                {
                  q: 'Can I verify old videos?',
                  a: 'Yes! The blockchain timestamp shows when you verified it, not when you created it. However, if someone else verified it first, their verification will have priority.',
                },
                {
                  q: 'What happens if VeriVid shuts down?',
                  a: 'Your verification remains valid forever. It lives on the blockchain, not on our servers. The blockchain is decentralized across thousands of nodes—it cannot be shut down.',
                },
                {
                  q: 'Can I verify videos I did not create?',
                  a: 'Technically yes, but it would be fraudulent. The timestamp proves when YOU verified it, not that you created it. If the actual creator verifies earlier, your verification means nothing legally.',
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A7E6FF] to-[#C6A0F6] flex items-center justify-center flex-shrink-0">
                      <span
                        className="text-[#16213E]"
                        style={{ fontSize: '0.875rem', fontWeight: 800 }}
                      >
                        Q
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-[#16213E] mb-2"
                        style={{ fontSize: '1rem', fontWeight: 700 }}
                      >
                        {faq.q}
                      </h3>
                      <p
                        className="text-[#16213E]/70"
                        style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}
                      >
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
