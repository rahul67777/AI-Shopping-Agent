import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
    selector: 'app-ai-score-badge',
    templateUrl: './ai-score-badge.component.html',
    styleUrl: './ai-score-badge.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiScoreBadgeComponent {
    score = input.required<number>();
    reason = input<string>('');
    showReason = input<boolean>(false);

    scoreColorClass = computed(() => {
        const s = this.score();
        if (s >= 95) return 'score-supreme';
        if (s >= 88) return 'score-excellent';
        if (s >= 75) return 'score-good';
        return 'score-average';
    });

    scoreLabel = computed(() => {
        const s = this.score();
        if (s >= 95) return 'AI Top Pick';
        if (s >= 88) return 'Great Match';
        if (s >= 75) return 'Good Fit';
        return 'Decent Match';
    });
}
