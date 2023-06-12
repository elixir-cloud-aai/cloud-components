import { html } from "@microsoft/fast-element";

const template = html`
<div class="accordion">
    <div class="accordion-item">
    <button class="accordion-header">Section 1<svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path></svg></i></button>
        <div class="accordion-content">
            <p>Content for section 1.</p>
        </div>
    </div>
    <!-- Repeat for other accordion items -->
</div>

`;

export default template;
