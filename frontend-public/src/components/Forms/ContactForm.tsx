import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useT } from "../../i18n";
import "../../styles/forms/contactForm.css";
import Button from "../General/Button";
import type { ContactFormPayload, ContactFormValues } from "../../types/forms";
import { createForm } from "../../api/forms";

type Props = {
  from: number;
  what: number;
};

export default function ContactForm({ from, what }: Props): React.ReactElement {
  const t = useT();
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const schema = z
    .object({
      name: z.string().min(1, t("footer.required")),
      surname: z.string().min(1, t("footer.required")),
      email: z.email(t("footer.emailErr")),
      phonePrefix: z.string().min(1, t("footer.required")),
      phone: z.string().min(1, t("footer.required")),
      message: z.string().min(1, t("footer.required")),
      gdpr: z.boolean().refine((val) => val === true, {
        message: t("footer.required"),
      }),
    })
    .superRefine((data, ctx) => {
      const fullPhone = `${data.phonePrefix}${data.phone}`;

      if (!isValidPhoneNumber(fullPhone)) {
        ctx.addIssue({
          path: ["phone"],
          code: "custom",
          message: t("footer.phoneErr"),
        });
      }
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phonePrefix: "+420",
      phone: "",
    },
  });

  const onSubmit = async (data: ContactFormValues): Promise<void> => {
    try {
      setSubmitStatus("idle");
      const payload: ContactFormPayload = {
        ...data,
        fullPhone: `${data.phonePrefix}${data.phone}`,
        from,
        what,
      };
      await createForm(payload);
      setSubmitStatus("success");
      setSubmitMessage(t("footer.success"));
      reset();
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 4000);
    } catch {
      setSubmitStatus("error");
      setSubmitMessage(t("footer.error"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-form" noValidate>
      <div className="grid-2">
        <div className="field">
          <label>{t("footer.name")} *</label>
          <input
            {...register("name")}
            className={errors.name ? "input error-input" : "input"}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="field">
          <label>{t("footer.surname")} *</label>
          <input
            {...register("surname")}
            className={errors.surname ? "input error-input" : "input"}
          />
          {errors.surname && (
            <span className="error">{errors.surname.message}</span>
          )}
        </div>

        <div className="field">
          <label>{t("footer.email")} *</label>
          <input
            type="email"
            {...register("email")}
            className={errors.email ? "input error-input" : "input"}
          />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </div>

        <div className="field">
          <label>{t("footer.phone")} *</label>

          <div className="phone-row">
            <input
              {...register("phonePrefix")}
              placeholder="+420"
              className={
                errors.phonePrefix
                  ? "prefix number error-input"
                  : "prefix number"
              }
            />

            <input
              {...register("phone")}
              placeholder="123 456 789"
              type="tel"
              className={
                errors.phone
                  ? "phoneInput number error-input "
                  : "phoneInput number"
              }
            />
          </div>
          <div className="phone-errors">
            {errors.phonePrefix && (
              <span className="error">{errors.phonePrefix.message}</span>
            )}
            {errors.phone && (
              <span className="error epho">{errors.phone.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="field full">
        <label>{t("footer.text")} *</label>
        <textarea
          {...register("message")}
          placeholder={t("footer.text_placeholder")}
          className={errors.message ? "input error-input" : "input"}
        />
        {errors.message && (
          <span className="error">{errors.message.message}</span>
        )}
      </div>

      <div className="gdpr-col">
        <label className="gdpr">
          <input type="checkbox" {...register("gdpr")} />
          <span>{t("footer.gdpr")} *</span>
        </label>
        {errors.gdpr && <span className="error">{errors.gdpr.message}</span>}
      </div>
      <input
        type="text"
        {...register("website")}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />
      <div className="submit-row">
        <p className="required-hint">* {t("footer.required")}</p>
        {submitStatus !== "idle" && (
          <p
            className={
              submitStatus === "success"
                ? "submit-msg success"
                : "submit-msg error"
            }
          >
            {submitMessage}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <span className="spinner" /> : t("footer.submit")}
        </Button>
      </div>
    </form>
  );
}
