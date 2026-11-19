'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Video,
  Image as ImageIcon,
  Info,
  X,
  AlertCircle,
  CheckCircle2,
  RotateCw,
  UploadCloud,
  ShieldCheck,
} from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { categoriesService, BackendCategory, CategoryAttribute } from '@/features/marketplace/categoriesService';
import { listingsService } from '@/features/marketplace/listingsService';
import {
  createListingClientSchema,
  validateImageFiles,
  validateVideoFile,
  validateCategoryAttributes,
  MEDIA_LIMITS,
} from '@/features/marketplace/listingValidation';
import { AuthPromptModal, getFriendlyErrorMessage } from '@/components/ui/state-views';
import { ApiError } from '@/lib/api-error';
import { INDIAN_STATES } from '@/features/location/indiaLocations';

export default function SellPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Categories state
  const [categories, setCategories] = React.useState<BackendCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = React.useState(true);
  const [selectedParentId, setSelectedParentId] = React.useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');
  const [categoryAttributes, setCategoryAttributes] = React.useState<CategoryAttribute[]>([]);
  const [attributesLoading, setAttributesLoading] = React.useState(false);

  // Form fields
  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [locationCity, setLocationCity] = React.useState(user?.locationCity || 'Mumbai');
  const [locationState, setLocationState] = React.useState(user?.locationState || 'Maharashtra');
  const [locationLocality, setLocationLocality] = React.useState('');
  const [contactPhone, setContactPhone] = React.useState(user?.phone || '');
  const [attributeValues, setAttributeValues] = React.useState<Record<string, unknown>>({});

  // Media files & previews
  const [images, setImages] = React.useState<{ file: File; previewUrl: string }[]>([]);
  const [video, setVideo] = React.useState<File | null>(null);
  const [videoName, setVideoName] = React.useState<string | null>(null);
  const [mediaError, setMediaError] = React.useState<string | null>(null);

  // Validation & submission state
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<number | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Auth Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  // Double submit prevention ref
  const submittingRef = React.useRef(false);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  // Prefill phone and location from user profile when auth changes
  React.useEffect(() => {
    Promise.resolve().then(() => {
      if (user?.phone && !contactPhone) {
        setContactPhone(user.phone);
      }
      if (user?.locationCity && locationCity === 'Mumbai') {
        setLocationCity(user.locationCity);
      }
      if (user?.locationState && locationState === 'Maharashtra') {
        setLocationState(user.locationState);
      }
    });
  }, [user, contactPhone, locationCity, locationState]);

  // Load active categories from API
  React.useEffect(() => {
    let ignore = false;

    categoriesService
      .getCategories('tree')
      .then((data) => {
        if (!ignore) {
          setCategories(data);
          if (data.length > 0) {
            const first = data[0];
            setSelectedParentId(first.id);
            if (first.children && first.children.length > 0) {
              setSelectedCategoryId(first.children[0].id);
            } else {
              setSelectedCategoryId(first.id);
            }
          }
          setCategoriesLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('[SellPage] Failed to fetch categories', err);
          setCategoriesLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Load category attributes when selected category changes
  React.useEffect(() => {
    if (!selectedCategoryId) return;

    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) setAttributesLoading(true);
    });

    categoriesService
      .getCategoryAttributes(selectedCategoryId)
      .then((attrs) => {
        if (!ignore) {
          setCategoryAttributes(attrs);
          setAttributeValues({});
          setAttributesLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.warn('[SellPage] No attributes for category', err);
          setCategoryAttributes([]);
          setAttributesLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedCategoryId]);

  // Cleanup preview URLs on unmount
  const imagesRef = React.useRef(images);
  React.useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  React.useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  // Handle image files selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaError(null);
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const { validFiles, errors } = validateImageFiles(files, images.length);

    if (errors.length > 0) {
      setMediaError(errors[0].reason);
    }

    if (validFiles.length > 0) {
      const newItems = validFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newItems].slice(0, MEDIA_LIMITS.MAX_IMAGES));
    }

    // Reset file input value to allow re-selection of same file
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // Handle video file selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      setMediaError(validation.error || 'Invalid video file');
      if (videoInputRef.current) videoInputRef.current.value = '';
      return;
    }

    setVideo(file);
    setVideoName(`${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoName(null);
  };

  // Handle dynamic attribute change
  const handleAttributeChange = (key: string, value: unknown) => {
    setAttributeValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate in-flight submissions
    if (submittingRef.current || isSubmitting) {
      return;
    }

    setSubmitError(null);
    setSubmitStatus(null);
    setFieldErrors({});

    // Check auth status
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    // Validate main form fields
    const validationResult = createListingClientSchema.safeParse({
      title,
      price: price ? Number(price) : undefined,
      currency: 'INR',
      description: description || undefined,
      categoryId: selectedCategoryId,
      locationCity,
      locationState,
      locationLocality: locationLocality || undefined,
      contactPhone,
    });

    const newErrors: Record<string, string> = {};

    if (!validationResult.success) {
      for (const issue of validationResult.error.issues) {
        const path = issue.path[0] as string;
        if (!newErrors[path]) {
          newErrors[path] = issue.message;
        }
      }
    }

    // Validate dynamic category attributes
    if (categoryAttributes.length > 0) {
      const attrErrors = validateCategoryAttributes(categoryAttributes, attributeValues);
      Object.assign(newErrors, attrErrors);
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      // Scroll to the first error
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    // Lock submission
    submittingRef.current = true;
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const created = await listingsService.createListing(
        {
          title: title.trim(),
          price: Number(price),
          currency: 'INR',
          description: description.trim() || undefined,
          categoryId: selectedCategoryId,
          locationCity: locationCity.trim(),
          locationState: locationState.trim() || undefined,
          locationLocality: locationLocality.trim() || undefined,
          contactPhone: contactPhone.trim(),
          status: 'ACTIVE',
          attributes: Object.keys(attributeValues).length > 0 ? attributeValues : undefined,
          images: images.map((item) => item.file),
          video,
        },
        (percent) => {
          setUploadProgress(percent);
        }
      );

      setIsSuccess(true);

      // Redirect to newly created listing
      setTimeout(() => {
        router.push(`/listing/${created.id}`);
      }, 1200);
    } catch (err: unknown) {
      submittingRef.current = false;
      setIsSubmitting(false);
      setUploadProgress(null);

      if (err instanceof ApiError) {
        setSubmitStatus(err.status);
        if (err.status === 401) {
          setIsAuthModalOpen(true);
          setSubmitError('Authentication expired or missing. Please sign in to post your ad.');
          return;
        }
        if (err.status === 413) {
          setSubmitError('Upload payload too large. The selected images or video exceed the maximum server limit (100MB).');
          return;
        }
        if (err.status === 422 || err.status === 400) {
          if (err.details && typeof err.details === 'object') {
            const serverErrors: Record<string, string> = {};
            const d = err.details as Record<string, unknown>;
            if (d.fieldErrors && typeof d.fieldErrors === 'object') {
              for (const [key, msgs] of Object.entries(d.fieldErrors as Record<string, string[]>)) {
                if (Array.isArray(msgs) && msgs.length > 0) {
                  serverErrors[key] = msgs[0];
                }
              }
            }
            if (Object.keys(serverErrors).length > 0) {
              setFieldErrors(serverErrors);
            }
          }
          setSubmitError(err.message || 'Validation error. Please verify the information entered.');
          return;
        }
        setSubmitError(err.message || 'Failed to post listing. Please try again.');
      } else {
        const friendly = getFriendlyErrorMessage(err);
        setSubmitError(friendly.description);
      }
    }
  };

  // Find parent and children categories
  const currentParent = categories.find((c) => c.id === selectedParentId) || categories[0];
  const childCategories = currentParent?.children || [];

  return (
    <PageContainer size="narrow" className="space-y-6 sm:space-y-8 pb-24 md:pb-12">
      {/* Page Heading */}
      <div className="space-y-2 text-center sm:text-left pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Post an Ad for Free</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50">
          Sell Fast on Bazarr 360
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
          Create your verified marketplace listing with photos and short-form video reels. 100% free with no listing charges.
        </p>
      </div>

      {/* Guest Warning Banner if not authenticated */}
      {!isAuthenticated && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 p-4 sm:p-5 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">Sign in to Post Your Ad</p>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
              You can draft your ad details below. You will be prompted to sign in or register before final submission so buyers can contact you safely.
            </p>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700 underline text-xs"
            >
              Sign In or Register Now
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {isSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-5 flex items-start gap-3 text-emerald-900 dark:text-emerald-200 animate-in fade-in"
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-base">Ad Created Successfully!</p>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              Your listing is now live across Bazarr 360. Redirecting to your listing page...
            </p>
          </div>
        </div>
      )}

      {/* Top-Level Error Feedback Banner */}
      {submitError && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 p-4 sm:p-5 flex items-start justify-between gap-3 text-xs text-rose-900 dark:text-rose-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm">
                {submitStatus === 413
                  ? 'File Size Limit Exceeded'
                  : submitStatus === 401
                  ? 'Sign In Required'
                  : 'Unable to Post Ad'}
              </p>
              <p className="text-rose-800 dark:text-rose-300 leading-relaxed">{submitError}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="shrink-0 border-rose-300 text-rose-700 hover:bg-rose-100"
          >
            <RotateCw className="w-3.5 h-3.5 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {/* Main Sell Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-8 shadow-xs"
      >
        {/* Step 1: Category Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              Select Category *
            </h2>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Parent category chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categories.map((cat) => {
                  const isSelected = selectedParentId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedParentId(cat.id);
                        if (cat.children && cat.children.length > 0) {
                          setSelectedCategoryId(cat.children[0].id);
                        } else {
                          setSelectedCategoryId(cat.id);
                        }
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 font-bold shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <span className="text-xs font-semibold">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Subcategories (if any) */}
              {childCategories.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
                    Subcategory:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {childCategories.map((child) => {
                      const isChildSelected = selectedCategoryId === child.id;
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => setSelectedCategoryId(child.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            isChildSelected
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                          }`}
                        >
                          {child.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {fieldErrors.categoryId && (
                <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.categoryId}</p>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Media Upload */}
        <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                Upload Photos & Video Reel
              </h2>
              <p className="text-[11px] text-zinc-500">
                Photos: up to 12 (max 10MB each, JPG/PNG/WebP). Video: 1 reel (max 50MB, MP4/WebM/MOV).
              </p>
            </div>
          </div>

          {/* Media feedback error */}
          {mediaError && (
            <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 p-3 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{mediaError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Photos Upload Area */}
            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-zinc-50/50 dark:bg-zinc-800/20 space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                  Add Photos ({images.length}/12)
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  JPG, PNG, WebP up to 10 MB each
                </span>
              </div>

              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                disabled={images.length >= MEDIA_LIMITS.MAX_IMAGES || isSubmitting}
                className="sr-only"
                id="photo-file-upload"
              />
              <label
                htmlFor="photo-file-upload"
                className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  images.length >= MEDIA_LIMITS.MAX_IMAGES || isSubmitting
                    ? 'opacity-50 cursor-not-allowed bg-zinc-200 text-zinc-500'
                    : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-orange-500 shadow-xs'
                }`}
              >
                {images.length >= MEDIA_LIMITS.MAX_IMAGES ? 'Photo Limit Reached' : 'Choose Photos'}
              </label>
            </div>

            {/* Video Reel Upload Area */}
            <div className="border-2 border-dashed border-orange-300 dark:border-orange-900/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-orange-50/30 dark:bg-orange-950/10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                  Upload Video Reel (Optional)
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  9:16 vertical video tour (MP4, WebM, max 50 MB)
                </span>
              </div>

              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={handleVideoSelect}
                disabled={Boolean(video) || isSubmitting}
                className="sr-only"
                id="video-file-upload"
              />
              {video ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/40 border border-orange-300 text-xs text-orange-900 dark:text-orange-200">
                  <span className="truncate max-w-[140px] font-medium">{videoName}</span>
                  <button
                    type="button"
                    onClick={removeVideo}
                    disabled={isSubmitting}
                    className="text-orange-700 dark:text-orange-300 hover:text-rose-600"
                    aria-label="Remove video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="video-file-upload"
                  className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSubmitting
                      ? 'opacity-50 cursor-not-allowed bg-zinc-200 text-zinc-500'
                      : 'bg-white dark:bg-zinc-800 border border-orange-200 dark:border-orange-800 text-orange-600 hover:bg-orange-50/50 shadow-xs'
                  }`}
                >
                  Select Video Reel
                </label>
              )}
            </div>
          </div>

          {/* Photo Previews Strip */}
          {images.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Selected Photos ({images.length})
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {images.map((item, idx) => {
                  const preview = item.previewUrl;
                  return (
                    <div
                      key={idx}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800"
                    >
                      {preview && (
                        <Image
                          src={preview}
                          alt={`Upload preview ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        disabled={isSubmitting}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-zinc-900/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
                        aria-label={`Remove photo ${idx + 1}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white">
                        #{idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Dynamic Category Specifications */}
        {categoryAttributes.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                {currentParent?.name} Specifications
              </h2>
            </div>

            {attributesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
                <div className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryAttributes.map((attr) => {
                  const key = attr.key || attr.name;
                  const label = attr.label || attr.name || attr.key;
                  const value = (attributeValues[key] as string) || '';
                  const hasAttrError = fieldErrors[key];

                  if (attr.options && attr.options.length > 0) {
                    return (
                      <div key={key} className="space-y-1.5">
                        <label
                          htmlFor={`attr-${key}`}
                          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                        >
                          {label} {attr.required && '*'}
                        </label>
                        <select
                          id={`attr-${key}`}
                          value={value}
                          onChange={(e) => handleAttributeChange(key, e.target.value)}
                          className={`w-full rounded-xl bg-white dark:bg-zinc-900 border px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 outline-none transition-colors ${
                            hasAttrError
                              ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                              : 'border-zinc-200 dark:border-zinc-800 focus:border-orange-500'
                          }`}
                        >
                          <option value="">Select {label}</option>
                          {attr.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {hasAttrError && (
                          <span className="text-[11px] text-rose-500 font-medium">
                            {hasAttrError}
                          </span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Input
                      key={key}
                      id={`attr-${key}`}
                      label={`${label} ${attr.required ? '*' : ''}`}
                      type={attr.type === 'number' ? 'number' : 'text'}
                      value={value}
                      placeholder={`Enter ${label}`}
                      onChange={(e) => handleAttributeChange(key, e.target.value)}
                      error={hasAttrError}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Ad Details & Pricing */}
        <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
              {categoryAttributes.length > 0 ? '4' : '3'}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              Ad Details & Pricing
            </h2>
          </div>

          <Input
            id="ad-title"
            label="Ad Title *"
            placeholder="e.g., Hyundai Creta SX 2022 Diesel or iPhone 14 Pro 128GB"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) {
                setFieldErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.title;
                  return copy;
                });
              }
            }}
            error={fieldErrors.title}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="ad-description"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Description
            </label>
            <textarea
              id="ad-description"
              rows={4}
              placeholder="Describe condition, reason for selling, accessories included, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
            {fieldErrors.description && (
              <span className="text-[11px] text-rose-500 font-medium">
                {fieldErrors.description}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="ad-price"
              label="Price (INR ₹) *"
              type="number"
              placeholder="e.g. 45000"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (fieldErrors.price) {
                  setFieldErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.price;
                    return copy;
                  });
                }
              }}
              leftAccessory={<span className="font-bold text-zinc-500">₹</span>}
              error={fieldErrors.price}
            />

            <Input
              id="ad-phone"
              label="Contact Phone Number *"
              type="tel"
              placeholder="e.g. 9876543210 or +919876543210"
              value={contactPhone}
              onChange={(e) => {
                setContactPhone(e.target.value);
                if (fieldErrors.contactPhone) {
                  setFieldErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.contactPhone;
                    return copy;
                  });
                }
              }}
              error={fieldErrors.contactPhone}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="ad-state"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                State
              </label>
              <select
                id="ad-state"
                value={locationState}
                onChange={(e) => {
                  setLocationState(e.target.value);
                  const st = INDIAN_STATES.find((s) => s.name === e.target.value);
                  if (st && st.popularCities.length > 0) {
                    setLocationCity(st.popularCities[0]);
                  }
                }}
                className="w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-50 outline-none focus:border-orange-500"
              >
                {INDIAN_STATES.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="ad-city"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                City *
              </label>
              <Input
                id="ad-city"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                placeholder="e.g. Mumbai, Pune"
                error={fieldErrors.locationCity}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="ad-locality"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Locality / Area
              </label>
              <Input
                id="ad-locality"
                value={locationLocality}
                onChange={(e) => setLocationLocality(e.target.value)}
                placeholder="e.g. Andheri West"
                error={fieldErrors.locationLocality}
              />
            </div>
          </div>
        </div>

        {/* Live Upload Progress Indicator */}
        {isSubmitting && (
          <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 space-y-2">
            <div className="flex items-center justify-between text-xs text-orange-900 dark:text-orange-200 font-semibold">
              <span className="flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 animate-bounce text-orange-600" />
                Uploading ad media & saving listing...
              </span>
              <span>{uploadProgress !== null ? `${uploadProgress}%` : 'Processing...'}</span>
            </div>
            <div className="w-full bg-orange-200 dark:bg-orange-950/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(5, uploadProgress || 10)}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit & Safety Footer */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>By posting, you agree to Bazarr 360 terms and buyer safety standards.</span>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 animate-spin" />
                Posting Ad...
              </span>
            ) : isSuccess ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                Posted!
              </span>
            ) : (
              'Post Ad Now'
            )}
          </Button>
        </div>
      </form>

      {/* Guest Sign-in Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Sign In to Post Your Ad"
        description="Please sign in or register to publish your listing on Bazarr 360. Your entered form data will be preserved."
        returnUrl="/sell"
      />
    </PageContainer>
  );
}
