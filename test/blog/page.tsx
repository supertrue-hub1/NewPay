'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";

const CATEGORIES = [
  { label: "Все статьи", count: 24, active: true },
  { label: "Советы", count: 8 },
  { label: "Новости МФО", count: 6 },
  { label: "Финансы", count: 5 },
  { label: "Законодательство", count: 3 },
  { label: "Истории", count: 2 },
];

const FEATURED_POST = {
  title: "Как выбрать надежную МФО: полный гайд для заемщика",
  excerpt: "Разбираемся, на что обратить внимание при выборе микрофинансовой организации. Проверка лицензии, отзывы, скрытые комиссии и условия досрочного погашения.",
  category: "Советы",
  date: "15 января 2025",
  readTime: "8 мин",
  slug: "how-to-choose-mfo",
};

const POSTS = [
  {
    title: "Первый займ под 0%: миф или реальность?",
    excerpt: "Актуальный список МФО, выдающих первый займ без процентов. Условия и подводные камни.",
    category: "Акции",
    date: "12 января 2025",
    readTime: "5 мин",
    color: "#10b981",
    slug: "first-loan-zero-percent",
  },
  {
    title: "Что делать, если не можете вернуть займ вовремя",
    excerpt: "Пошаговый план действий при финансовых трудностях. Реструктуризация, пролонгация и правовая защита.",
    category: "Советы",
    date: "10 января 2025",
    readTime: "6 мин",
    color: "#f59e0b",
    slug: "cannot-repay-loan",
  },
  {
    title: "Новые правила работы МФО в 2025 году",
    excerpt: "Обзор законодательных изменений. Как новые нормы защитят заемщиков.",
    category: "Законодательство",
    date: "8 января 2025",
    readTime: "7 мин",
    color: "#6366f1",
    slug: "new-mfo-rules-2025",
  },
  {
    title: "5 способов улучшить кредитную историю",
    excerpt: "Практические советы по восстановлению рейтинга. Работающие стратегии и частые ошибки.",
    category: "Финансы",
    date: "5 января 2025",
    readTime: "5 мин",
    color: "#0ea5e9",
    slug: "improve-credit-history",
  },
  {
    title: "Онлайн-займы vs банковский кредит: что выбрать?",
    excerpt: "Сравниваем условия, сроки и выгоды. Когда лучше обратиться в МФО, а когда — в банк.",
    category: "Советы",
    date: "3 января 2025",
    readTime: "6 мин",
    color: "#10b981",
    slug: "online-loans-vs-bank-credit",
  },
  {
    title: "Топ-10 МФО с самым высоким рейтингом",
    excerpt: "Рейтинг надежных микрофинансовых организаций по отзывам клиентов и условиям.",
    category: "Рейтинги",
    date: "1 января 2025",
    readTime: "4 мин",
    color: "#ec4899",
    slug: "top-10-mfo-rating",
  },
];

function PostCard({ post }: { post: typeof POSTS[0] }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
          borderColor: "transparent",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          height: 4,
          bgcolor: post.color,
          borderRadius: "12px 12px 0 0",
        }}
      />
      <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Chip
          label={post.category}
          size="small"
          sx={{
            alignSelf: "flex-start",
            bgcolor: `${post.color}15`,
            color: post.color,
            fontWeight: 500,
            fontSize: "0.7rem",
            height: 22,
            mb: 1.5,
          }}
        />
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            color: "#0f172a",
            mb: 1,
            lineHeight: 1.4,
          }}
        >
          {post.title}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "#64748b",
            lineHeight: 1.5,
            mb: 2,
            flex: 1,
          }}
        >
          {post.excerpt}
        </Typography>
        <Divider sx={{ my: 1.5, borderColor: "#f1f5f9" }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
            {post.date}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AccessTimeIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
            <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              {post.readTime}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function BlogPage() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f8fafc" }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              color: "#0f172a",
              letterSpacing: "-0.03em",
              mb: 1,
            }}
          >
            Блог
          </Typography>
          <Typography
            sx={{
              fontSize: "0.9rem",
              color: "#64748b",
              maxWidth: 500,
            }}
          >
            Полезные статьи о микрофинансах, советы заемщикам и новости рынка
          </Typography>
        </Box>

        {/* Search & Categories */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            bgcolor: "white",
            borderRadius: 3,
            border: "1px solid #e2e8f0",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="stretch">
            {/* Search */}
            <TextField
              placeholder="Поиск статей..."
              size="small"
              fullWidth
              sx={{
                maxWidth: { md: 300 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "&:hover fieldset": { borderColor: "#cbd5e1" },
                  "&.Mui-focused fieldset": { borderColor: "#10b981" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Categories */}
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat.label}
                  label={`${cat.label} (${cat.count})`}
                  sx={{
                    bgcolor: cat.active ? "#0f172a" : "#f1f5f9",
                    color: cat.active ? "white" : "#475569",
                    fontWeight: 500,
                    fontSize: "0.8rem",
                    height: 32,
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: cat.active ? "#0f172a" : "#e2e8f0",
                    },
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Paper>

        {/* Featured Post */}
        <Link href={`/blog/${FEATURED_POST.slug}`} style={{ textDecoration: "none" }}>
          <Paper
            elevation={0}
            sx={{
              display: "block",
              p: { xs: 3, md: 4 },
              mb: 4,
              bgcolor: "white",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                borderColor: "transparent",
                transform: "translateY(-2px)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "4px",
                height: "100%",
                background: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
              },
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <Chip
                    label={FEATURED_POST.category}
                    size="small"
                    sx={{
                      bgcolor: "#dcfce7",
                      color: "#059669",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                  <Chip
                    label="Избранное"
                    size="small"
                    sx={{
                      bgcolor: "#fef3c7",
                      color: "#b45309",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                </Stack>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                    mb: 1,
                    lineHeight: 1.3,
                  }}
                >
                  {FEATURED_POST.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    color: "#64748b",
                    lineHeight: 1.6,
                    mb: 2,
                    maxWidth: 600,
                  }}
                >
                  {FEATURED_POST.excerpt}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTimeIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    <Typography sx={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                      {FEATURED_POST.readTime}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    {FEATURED_POST.date}
                  </Typography>
                </Stack>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#10b981",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                Читать
                <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </Box>
            </Stack>
          </Paper>
        </Link>

        {/* Posts Grid */}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1.1rem",
            color: "#0f172a",
            mb: 2,
          }}
        >
          Все статьи
        </Typography>

        <Grid container spacing={3}>
          {POSTS.map((post) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.slug}>
              <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                <PostCard post={post} />
              </Link>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Stack direction="row" spacing={1}>
            {[1, 2, 3, "...", 5].map((page, i) => (
              <Box
                key={i}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  border: "none",
                  bgcolor: page === 1 ? "#0f172a" : "transparent",
                  color: page === 1 ? "white" : "#475569",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: page === 1 ? "#0f172a" : "#f1f5f9",
                  },
                }}
              >
                {page}
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
