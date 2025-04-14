import { AbstractControl, ValidationErrors } from '@angular/forms';

export function urlValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  try {
    const url = new URL(control.value);
    
    // Check if it's a YouTube or Vimeo URL
    const isYouTube = url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be');
    const isVimeo = url.hostname.includes('vimeo.com');

    if (!isYouTube && !isVimeo) {
      return { invalidUrl: true };
    }

    return null;
  } catch {
    return { invalidUrl: true };
  }
}