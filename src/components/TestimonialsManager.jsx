import React, { useEffect, useState } from "react";
import {
  Check,
  Edit3,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

const API =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.rjrinfinity.com/api";


const testimonialInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: "46px",
  padding: "11px 13px",
  border: "1px solid #cfcfcf",
  borderRadius: "0px",
  background: "#ffffff",
  color: "#111111",
  fontSize: "14px",
  lineHeight: "1.4",
  outline: "none",
  appearance: "none",
};

const testimonialTextareaStyle = {
  ...testimonialInputStyle,
  minHeight: "130px",
  resize: "vertical",
  fontFamily: "inherit",
};

const testimonialSelectStyle = {
  ...testimonialInputStyle,
  cursor: "pointer",
};

  
/*
|--------------------------------------------------------------------------
| EMPTY FORM
|--------------------------------------------------------------------------
*/

const EMPTY_FORM = {
  customer_name: "",
  customer_role: "",
  customer_location: "",
  rating: 5,
  feedback: "",
  photo_url: "",
  is_featured: false,
  is_active: true,
  display_order: 0,
};

/*
|--------------------------------------------------------------------------
| AUTHENTICATED ADMIN REQUEST
|--------------------------------------------------------------------------
*/

async function adminRequest(endpoint, options = {}) {
  const token = localStorage.getItem("griphill_admin_token");

  const response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401) {
    localStorage.removeItem("griphill_admin_token");
    window.location.href = "/admin/login";
    throw new Error("Your admin session has expired.");
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  

  /*
  |--------------------------------------------------------------------------
  | LOAD TESTIMONIALS
  |--------------------------------------------------------------------------
  */

  async function loadTestimonials() {
    try {
      setLoading(true);
      setError("");

      const result = await adminRequest(
        "/griphill/admin/testimonials"
      );

      setTestimonials(
        Array.isArray(result?.testimonials)
          ? result.testimonials
          : []
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load testimonials."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FORM HELPERS
  |--------------------------------------------------------------------------
  */

  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(false);
  }

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | ADD
  |--------------------------------------------------------------------------
  */

  function openAddForm() {
    setSuccess("");
    setError("");

    setForm({
      ...EMPTY_FORM,
    });

    setEditingId(null);
    setShowForm(true);
  }

  /*
  |--------------------------------------------------------------------------
  | EDIT
  |--------------------------------------------------------------------------
  */

  function openEditForm(testimonial) {
    setSuccess("");
    setError("");

    setForm({
      customer_name:
        testimonial.customer_name || "",

      customer_role:
        testimonial.customer_role || "",

      customer_location:
        testimonial.customer_location || "",

      rating:
        Number(testimonial.rating || 5),

      feedback:
        testimonial.feedback || "",

      photo_url:
        testimonial.photo_url || "",

      is_featured:
        Boolean(testimonial.is_featured),

      is_active:
        Boolean(testimonial.is_active),

      display_order:
        Number(testimonial.display_order || 0),
    });

    setEditingId(testimonial.id);
    setShowForm(true);
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  async function saveTestimonial(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        customerName:
          form.customer_name.trim(),

        customerRole:
          form.customer_role.trim(),

        customerLocation:
          form.customer_location.trim(),

        rating:
          Number(form.rating),

        feedback:
          form.feedback.trim(),

        photoUrl:
          form.photo_url.trim(),

        isFeatured:
          Boolean(form.is_featured),

        isActive:
          Boolean(form.is_active),

        displayOrder:
          Number(form.display_order || 0),
      };

      /*
      |--------------------------------------------------------------------------
      | VALIDATION
      |--------------------------------------------------------------------------
      */

      if (!payload.customerName) {
        throw new Error(
          "Customer name is required."
        );
      }

      if (!payload.feedback) {
        throw new Error(
          "Customer feedback is required."
        );
      }

      if (
        payload.rating < 1 ||
        payload.rating > 5
      ) {
        throw new Error(
          "Rating must be between 1 and 5."
        );
      }

      let result;

      /*
      |--------------------------------------------------------------------------
      | UPDATE
      |--------------------------------------------------------------------------
      */

      if (editingId) {
        result = await adminRequest(
          `/griphill/admin/testimonials/${editingId}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | CREATE
      |--------------------------------------------------------------------------
      */

      else {
        result = await adminRequest(
          "/griphill/admin/testimonials",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
      }

      if (!result?.success) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Unable to save testimonial."
        );
      }

      setSuccess(
        editingId
          ? "Testimonial updated successfully."
          : "Testimonial added successfully."
      );

      resetForm();

      await loadTestimonials();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to save testimonial."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  async function deleteTestimonial(testimonial) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the testimonial from ${testimonial.customer_name}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const result = await adminRequest(
        `/griphill/admin/testimonials/${testimonial.id}`,
        {
          method: "DELETE",
        }
      );

      if (!result?.success) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Unable to delete testimonial."
        );
      }

      setSuccess(
        "Testimonial deleted successfully."
      );

      await loadTestimonials();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to delete testimonial."
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | PUBLISH / UNPUBLISH
  |--------------------------------------------------------------------------
  */

  async function toggleActive(testimonial) {
    try {
      setError("");
      setSuccess("");

      const result = await adminRequest(
        `/griphill/admin/testimonials/${testimonial.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isActive:
              !Boolean(testimonial.is_active),
          }),
        }
      );

      if (!result?.success) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Unable to update testimonial."
        );
      }

      setSuccess(
        testimonial.is_active
          ? "Testimonial unpublished."
          : "Testimonial published."
      );

      await loadTestimonials();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to update testimonial."
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | FEATURED / UNFEATURED
  |--------------------------------------------------------------------------
  */

  async function toggleFeatured(testimonial) {
    try {
      setError("");
      setSuccess("");

      const result = await adminRequest(
        `/griphill/admin/testimonials/${testimonial.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isFeatured:
              !Boolean(testimonial.is_featured),
          }),
        }
      );

      if (!result?.success) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Unable to update testimonial."
        );
      }

      setSuccess(
        testimonial.is_featured
          ? "Testimonial removed from featured."
          : "Testimonial marked as featured."
      );

      await loadTestimonials();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to update testimonial."
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | STAR DISPLAY
  |--------------------------------------------------------------------------
  */

  function renderStars(rating) {
    const value = Number(rating || 0);

    return (
      <span
        style={{
          display: "inline-flex",
          gap: "2px",
          alignItems: "center",
        }}
      >
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <Star
              key={star}
              size={15}
              fill={
                star <= value
                  ? "currentColor"
                  : "none"
              }
              strokeWidth={1.7}
            />
          )
        )}
      </span>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section
      style={{
        marginTop: "30px",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "22px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p className="eyebrow">
            CUSTOMER EXPERIENCE
          </p>

          <h2
            style={{
              margin: "5px 0 6px",
            }}
          >
            Testimonials
          </h2>

          <p
            style={{
              margin: 0,
              opacity: 0.65,
            }}
          >
            Manage customer feedback displayed
            on the Grip Hill website.
          </p>
        </div>

        <button
          type="button"
          className="button button-dark"
          onClick={openAddForm}
        >
          <Plus size={17} />
          Add testimonial
        </button>
      </div>

      {/* =====================================================
          SUCCESS
      ====================================================== */}

      {success && (
        <div
          className="form-success"
          style={{
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Check size={16} />
          {success}
        </div>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          className="form-error"
          style={{
            marginBottom: "18px",
          }}
        >
          {error}
        </div>
      )}

      {/* =====================================================
          ADD / EDIT FORM
      ====================================================== */}

      {showForm && (
        <div
          style={{
            border: "1px solid #e7e7e7",
            padding: "24px",
            marginBottom: "25px",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <p className="eyebrow">
                {editingId
                  ? "EDIT TESTIMONIAL"
                  : "NEW TESTIMONIAL"}
              </p>

              <h3
                style={{
                  margin: "5px 0 0",
                }}
              >
                {editingId
                  ? "Update customer feedback"
                  : "Add customer feedback"}
              </h3>
            </div>

            <button
              type="button"
              onClick={resetForm}
              aria-label="Close"
              style={{
                border: 0,
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={saveTestimonial}
          >
            <div className="checkout-grid">

              {/* CUSTOMER NAME */}

              <label>
                Customer name *

<input
  type="text"
  value={form.customer_name}
  onChange={(e) =>
    updateField(
      "customer_name",
      e.target.value
    )
  }
  placeholder="Rahul Sharma"
  required
  style={testimonialInputStyle}
/>
              </label>

              {/* CUSTOMER ROLE */}

              <label>
                Customer role

                <input
                  type="text"
                  value={form.customer_role}
                  onChange={(e) =>
                    updateField(
                      "customer_role",
                      e.target.value
                    )
                  }
                  placeholder="IT Professional"
                  style={testimonialInputStyle}
                />
              </label>

              {/* LOCATION */}

              <label>
                Location

                <input
                  type="text"
                  value={form.customer_location}
                  onChange={(e) =>
                    updateField(
                      "customer_location",
                      e.target.value
                    )
                  }
                  placeholder="Kolkata"
                  style={testimonialInputStyle}
                />
              </label>

              {/* RATING */}

              <label>
                Rating *

                <select
                  value={form.rating}
                  onChange={(e) =>
                    updateField(
                      "rating",
                      Number(e.target.value)
                    )
                  }
                >
                  <option value={5}>
                    5 Stars
                  </option>

                  <option value={4}>
                    4 Stars
                  </option>

                  <option value={3}>
                    3 Stars
                  </option>

                  <option value={2}>
                    2 Stars
                  </option>

                  <option value={1}>
                    1 Star
                  </option>
                </select>

                <div
                  style={{
                    marginTop: "7px",
                  }}
                >
                  {renderStars(form.rating)}
                </div>
              </label>

              {/* FEEDBACK */}

              <label className="span-2">
                Customer feedback *

                <textarea
                  value={form.feedback}
                  onChange={(e) =>
                    updateField(
                      "feedback",
                      e.target.value
                    )
                  }
                  placeholder="Write the customer's feedback..."
                  rows={5}
                  required
                  style={testimonialTextareaStyle}
                />
              </label>

              {/* PHOTO */}

              <label className="span-2">
                Customer photo URL

                <input
                  type="text"
                  value={form.photo_url}
                  onChange={(e) =>
                    updateField(
                      "photo_url",
                      e.target.value
                    )
                  }
                  placeholder="/testimonials/customer.jpg"
                  style={testimonialInputStyle}
                />
              </label>

              {/* DISPLAY ORDER */}

              <label>
                Display order

                <input
                  type="number"
                  min="0"
                  value={form.display_order}
                  onChange={(e) =>
                    updateField(
                      "display_order",
                      Number(e.target.value)
                    )
                  }
                  style={testimonialInputStyle}
                />
              </label>

              {/* OPTIONS */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) =>
                      updateField(
                        "is_featured",
                        e.target.checked
                      )
                    }
                  />

                  Featured testimonial
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      updateField(
                        "is_active",
                        e.target.checked
                      )
                    }
                  />

                  Publish on website
                </label>
              </div>
            </div>

            {/* FORM BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                type="submit"
                className="button button-dark"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update testimonial"
                  : "Save testimonial"}

                <Check size={17} />
              </button>

              <button
                type="button"
                className="text-link"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="loading-state">
          Loading testimonials...
        </div>
      )}

      {/* =====================================================
          EMPTY
      ====================================================== */}

      {!loading &&
        testimonials.length === 0 && (
          <div
            className="empty-state"
            style={{
              padding: "45px 20px",
            }}
          >
            <Star size={32} />

            <p>
              No testimonials have been added
              yet.
            </p>

            <button
              type="button"
              className="button button-dark"
              onClick={openAddForm}
            >
              <Plus size={17} />
              Add first testimonial
            </button>
          </div>
        )}

      {/* =====================================================
          TESTIMONIAL LIST
      ====================================================== */}

      {!loading &&
        testimonials.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            {testimonials.map(
              (testimonial) => (
                <article
                  key={testimonial.id}
                  style={{
                    border:
                      "1px solid #e7e7e7",
                    background: "#fff",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: "20px",
                      alignItems:
                        "flex-start",
                    }}
                  >
                    {/* LEFT */}

                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        minWidth: 0,
                      }}
                    >
                      {/* PHOTO */}

                      {testimonial.photo_url ? (
                        <img
                          src={
                            testimonial.photo_url
                          }
                          alt={
                            testimonial.customer_name
                          }
                          style={{
                            width: "55px",
                            height: "55px",
                            objectFit:
                              "cover",
                            borderRadius:
                              "50%",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "55px",
                            height: "55px",
                            borderRadius:
                              "50%",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            background:
                              "#f3f3f3",
                            flexShrink: 0,
                          }}
                        >
                          <Star size={20} />
                        </div>
                      )}

                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <h3
                          style={{
                            margin:
                              "0 0 4px",
                          }}
                        >
                          {
                            testimonial.customer_name
                          }
                        </h3>

                        <p
                          style={{
                            margin:
                              "0 0 8px",
                            opacity: 0.65,
                            fontSize:
                              "13px",
                          }}
                        >
                          {testimonial.customer_role ||
                            "Customer"}

                          {testimonial.customer_location
                            ? ` · ${testimonial.customer_location}`
                            : ""}
                        </p>

                        <div
                          style={{
                            marginBottom:
                              "10px",
                          }}
                        >
                          {renderStars(
                            testimonial.rating
                          )}
                        </div>

                        <p
                          style={{
                            margin: 0,
                            lineHeight: 1.65,
                          }}
                        >
                          "
                          {
                            testimonial.feedback
                          }
                          "
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}

                    <div
                      style={{
                        display: "flex",
                        flexDirection:
                          "column",
                        alignItems:
                          "flex-end",
                        gap: "8px",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          padding:
                            "5px 9px",
                          border:
                            "1px solid #ddd",
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.06em",
                        }}
                      >
                        {testimonial.is_active
                          ? "Published"
                          : "Hidden"}
                      </span>

                      {testimonial.is_featured && (
                        <span
                          style={{
                            fontSize: "11px",
                            padding:
                              "5px 9px",
                            border:
                              "1px solid #ddd",
                            textTransform:
                              "uppercase",
                            letterSpacing:
                              "0.06em",
                          }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "flex-end",
                      gap: "8px",
                      marginTop: "18px",
                      paddingTop: "15px",
                      borderTop:
                        "1px solid #eee",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      className="text-link"
                      onClick={() =>
                        toggleActive(
                          testimonial
                        )
                      }
                    >
                      {testimonial.is_active
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    <button
                      type="button"
                      className="text-link"
                      onClick={() =>
                        toggleFeatured(
                          testimonial
                        )
                      }
                    >
                      {testimonial.is_featured
                        ? "Remove featured"
                        : "Make featured"}
                    </button>

                    <button
                      type="button"
                      className="text-link"
                      onClick={() =>
                        openEditForm(
                          testimonial
                        )
                      }
                    >
                      <Edit3 size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="text-link"
                      onClick={() =>
                        deleteTestimonial(
                          testimonial
                        )
                      }
                      style={{
                        color: "#b42318",
                      }}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
    </section>
  );
}