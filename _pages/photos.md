---
layout: page
title: Photos
permalink: /photos/
nav: true
nav_order: 5
description: Personal photography journal
---

<link rel="stylesheet" href="{{ '/assets/css/photos.css' | relative_url }}">

<div class="photo-journal" data-photo-journal>
  <header class="photo-header">
    <p class="photo-eyebrow">PERSONAL PHOTOGRAPHY JOURNAL</p>
    <div class="photo-heading-row">
      <div>
        <h1>Photos</h1>
        <p class="photo-intro">城市的片刻，山野的呼吸。沿着光，收藏一路的风景。</p>
      </div>
      <p class="photo-count" data-photo-count>{{ site.data.photos | size }} 张作品</p>
    </div>
  </header>

  <section class="photo-filters" aria-label="筛选摄影作品">
    <div class="photo-filter-group" data-filter-group="subjects">
      <span class="photo-filter-title">题材</span>
      <div class="photo-filter-options" role="group" aria-label="按题材筛选">
        <button type="button" class="photo-filter is-active" data-filter="all" aria-pressed="true">全部</button>
        {% for tag in site.data.photo_tags.subjects %}
          {% unless tag.value == 'unassigned' %}
            <button type="button" class="photo-filter" data-filter="{{ tag.value | escape }}" aria-pressed="false">{{ tag.label }}</button>
          {% endunless %}
        {% endfor %}
      </div>
    </div>
    <div class="photo-filter-group" data-filter-group="locations">
      <span class="photo-filter-title">地点</span>
      <div class="photo-filter-options" role="group" aria-label="按地点筛选">
        <button type="button" class="photo-filter is-active" data-filter="all" aria-pressed="true">全部</button>
        {% for tag in site.data.photo_tags.locations %}
          {% unless tag.value == 'unassigned' %}
            <button type="button" class="photo-filter" data-filter="{{ tag.value | escape }}" aria-pressed="false">{{ tag.label }}</button>
          {% endunless %}
        {% endfor %}
      </div>
    </div>
  </section>

  <div class="photo-grid" data-photo-grid>
    {% for photo in site.data.photos %}
      <figure class="photo-card photo-reveal" data-subjects="{{ photo.subjects | join: ',' }}" data-locations="{{ photo.locationTags | join: ',' }}">
        <button type="button" class="photo-image-button" aria-label="放大查看：{{ photo.title | escape }}" data-photo-open>
          <img src="{{ photo.image | relative_url }}" alt="{{ photo.alt | escape }}" loading="lazy" decoding="async" draggable="false">
        </button>
        <figcaption>
          <span class="photo-title">{{ photo.title }}</span>
          {% if photo.location %}<span class="photo-location">{{ photo.location }}</span>{% endif %}
        </figcaption>
      </figure>
    {% endfor %}
  </div>
  <p class="photo-empty" data-photo-empty hidden>这个筛选组合还没有照片。</p>
</div>

<div class="photo-lightbox" data-photo-lightbox hidden role="dialog" aria-modal="true" aria-label="放大查看图片">
  <button type="button" class="photo-lightbox-close" data-photo-close aria-label="关闭图片">×</button>
  <img data-photo-lightbox-image alt="" draggable="false">
</div>
<script src="{{ '/assets/js/photos.js' | relative_url }}" defer></script>
