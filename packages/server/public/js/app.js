const state = {
  page: 1,
  limit: 20,
  totalPages: 1,
  starred: false,
  feedId: "",
  query: "",
};

let searchDebounce;

const els = {
  tabBtns: document.querySelectorAll(".tab-btn"),
  views: {
    articles: document.getElementById("articles-view"),
    feeds: document.getElementById("feeds-view"),
  },
  searchInput: document.getElementById("search-input"),
  feedFilter: document.getElementById("feed-filter"),
  toggleBtns: document.querySelectorAll(".toggle-btn"),
  articleList: document.getElementById("article-list"),
  prevBtn: document.getElementById("prev-page"),
  nextBtn: document.getElementById("next-page"),
  pageInfo: document.getElementById("page-info"),
  addFeedForm: document.getElementById("add-feed-form"),
  feedUrlInput: document.getElementById("feed-url-input"),
  feedError: document.getElementById("feed-error"),
  feedList: document.getElementById("feed-list"),
  modal: document.getElementById("article-modal"),
  modalClose: document.getElementById("modal-close"),
  modalTitle: document.getElementById("modal-title"),
  modalMeta: document.getElementById("modal-meta"),
  modalBody: document.getElementById("modal-body"),
  modalLink: document.getElementById("modal-link"),
  modalStar: document.getElementById("modal-star"),
};

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || "request failed");
  return body;
}

// --- tabs ---

els.tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    els.tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    Object.entries(els.views).forEach(([key, view]) =>
      view.classList.toggle("hidden", key !== tab),
    );
    if (tab === "feeds") loadFeeds();
  });
});

// --- article list ---

async function loadFeedOptions() {
  const { data } = await fetchJSON("/feeds?limit=100&disabled=true");
  const current = els.feedFilter.value;
  els.feedFilter.innerHTML = '<option value="">all feeds</option>';
  data.forEach((feed) => {
    const opt = document.createElement("option");
    opt.value = feed.id;
    opt.textContent = feed.title || feed.url;
    els.feedFilter.appendChild(opt);
  });
  els.feedFilter.value = current;
}

async function loadArticles() {
  const params = new URLSearchParams({ page: state.page, limit: state.limit });
  if (state.query) params.set("query", state.query);
  if (state.feedId) params.set("feed", state.feedId);
  if (state.starred) params.set("starred", "true");

  els.articleList.innerHTML = '<li class="loading">loading...</li>';

  try {
    const { data, meta } = await fetchJSON(`/articles?${params}`);
    state.totalPages = meta.totalPages || 1;
    renderArticles(data);
    updatePagination(meta);
  } catch (err) {
    els.articleList.innerHTML = `<li class="error">${err.message}</li>`;
  }
}

function renderArticles(articles) {
  els.articleList.innerHTML = "";

  if (!articles.length) {
    els.articleList.innerHTML = '<li class="empty">no articles found</li>';
    return;
  }

  articles.forEach((article) => {
    const li = document.createElement("li");
    li.className = `article-item${article.isRead ? "" : " unread"}`;

    const title = document.createElement("span");
    title.className = "article-title";
    title.textContent = article.title;

    const meta = document.createElement("span");
    meta.className = "article-meta";
    meta.textContent = fmtDate(article.publishedAt);

    const starBtn = document.createElement("button");
    starBtn.className = `star-btn${article.isStarred ? " active" : ""}`;
    starBtn.textContent = article.isStarred ? "★" : "☆";
    starBtn.title = "toggle star";
    starBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleStar(article);
    });

    li.append(title, meta, starBtn);
    li.addEventListener("click", () => openArticle(article));
    els.articleList.appendChild(li);
  });
}

function updatePagination(meta) {
  const totalPages = meta.totalPages || 1;
  els.pageInfo.textContent = `page ${meta.page} / ${totalPages}`;
  els.prevBtn.disabled = meta.page <= 1;
  els.nextBtn.disabled = meta.page >= totalPages;
}

async function toggleStar(article) {
  const newStarred = !article.isStarred;
  await fetchJSON(
    `/articles/${article.id}/star${newStarred ? "" : "?unstar=true"}`,
    { method: "POST" },
  );
  loadArticles();
}

async function openArticle(article) {
  els.modal.classList.remove("hidden");
  els.modalTitle.textContent = article.title;
  els.modalMeta.textContent = [fmtDate(article.publishedAt), article.author]
    .filter(Boolean)
    .join(" · ");
  els.modalBody.innerHTML = "<p>loading...</p>";
  els.modalLink.href = article.url || "#";
  setStarButton(article.isStarred);

  if (!article.isRead) {
    fetchJSON(`/articles/${article.id}/mark-read`, { method: "POST" }).then(
      loadArticles,
    );
  }

  try {
    const { data } = await fetchJSON(`/articles/${article.id}`);
    els.modalBody.innerHTML =
      data.content || data.summary || "<p>no content available</p>";
    setStarButton(data.isStarred);

    els.modalStar.onclick = async () => {
      const newStarred = !data.isStarred;
      await fetchJSON(
        `/articles/${data.id}/star${newStarred ? "" : "?unstar=true"}`,
        { method: "POST" },
      );
      data.isStarred = newStarred;
      setStarButton(newStarred);
      loadArticles();
    };
  } catch (err) {
    els.modalBody.innerHTML = `<p class="error">${err.message}</p>`;
  }
}

function setStarButton(isStarred) {
  els.modalStar.classList.toggle("active", !!isStarred);
  els.modalStar.textContent = isStarred ? "★ starred" : "☆ star";
}

els.modalClose.addEventListener("click", () =>
  els.modal.classList.add("hidden"),
);
els.modal.addEventListener("click", (e) => {
  if (e.target === els.modal) els.modal.classList.add("hidden");
});

els.searchInput.addEventListener("input", (e) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    state.query = e.target.value.trim();
    state.page = 1;
    loadArticles();
  }, 300);
});

els.feedFilter.addEventListener("change", (e) => {
  state.feedId = e.target.value;
  state.page = 1;
  loadArticles();
});

els.toggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    els.toggleBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.starred = btn.dataset.filter === "starred";
    state.page = 1;
    loadArticles();
  });
});

els.prevBtn.addEventListener("click", () => {
  if (state.page > 1) {
    state.page -= 1;
    loadArticles();
  }
});

els.nextBtn.addEventListener("click", () => {
  if (state.page < state.totalPages) {
    state.page += 1;
    loadArticles();
  }
});

// --- feeds ---

async function loadFeeds() {
  els.feedList.innerHTML = '<li class="loading">loading...</li>';
  try {
    const { data } = await fetchJSON("/feeds?limit=100&disabled=true");
    renderFeeds(data);
  } catch (err) {
    els.feedList.innerHTML = `<li class="error">${err.message}</li>`;
  }
}

function renderFeeds(feeds) {
  els.feedList.innerHTML = "";

  if (!feeds.length) {
    els.feedList.innerHTML = '<li class="empty">no feeds yet</li>';
    return;
  }

  feeds.forEach((feed) => {
    const li = document.createElement("li");
    li.className = `feed-item${feed.isDisabled ? " disabled" : ""}`;

    const title = document.createElement("div");
    title.className = "feed-title";
    title.textContent = feed.title || feed.url;

    const url = document.createElement("div");
    url.className = "feed-url";
    url.textContent = feed.url;

    const actions = document.createElement("div");
    actions.className = "feed-actions";

    const syncBtn = document.createElement("button");
    syncBtn.textContent = "sync";
    syncBtn.addEventListener("click", async () => {
      syncBtn.disabled = true;
      syncBtn.textContent = "syncing...";
      try {
        await fetchJSON(`/feeds/${feed.id}/sync`, { method: "POST" });
      } finally {
        syncBtn.disabled = false;
        syncBtn.textContent = "sync";
      }
    });

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = feed.isDisabled ? "enable" : "disable";
    toggleBtn.addEventListener("click", async () => {
      await fetchJSON(
        `/feeds/${feed.id}/disable${feed.isDisabled ? "?enable=true" : ""}`,
        { method: "POST" },
      );
      loadFeeds();
      loadFeedOptions();
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "remove";
    removeBtn.className = "danger";
    removeBtn.addEventListener("click", async () => {
      if (!confirm(`remove "${feed.title || feed.url}"?`)) return;
      await fetchJSON(`/feeds/${feed.id}`, { method: "DELETE" });
      loadFeeds();
      loadFeedOptions();
      loadArticles();
    });

    actions.append(syncBtn, toggleBtn, removeBtn);
    li.append(title, url, actions);
    els.feedList.appendChild(li);
  });
}

els.addFeedForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  els.feedError.classList.add("hidden");
  const feedUrl = els.feedUrlInput.value.trim();
  if (!feedUrl) return;

  try {
    await fetchJSON("/feeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedUrl }),
    });
    els.feedUrlInput.value = "";
    loadFeeds();
    loadFeedOptions();
  } catch (err) {
    els.feedError.textContent = err.message;
    els.feedError.classList.remove("hidden");
  }
});

// --- init ---

loadFeedOptions();
loadArticles();
