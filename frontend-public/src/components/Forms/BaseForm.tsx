import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useT } from "../../i18n";
import "../../styles/forms/baseForm.css";
import Button from "../General/Button";
import type { ContactFormValues, InqueryFormValues } from "../../types/forms";
import { createForm } from "../../api/forms";
import { useLang } from "../../hooks/i18n/useLang";
import InqueryFormPartRHF from "./InqueryFormPartRHF";
type Props =
  | { from: number; what: 1 }
  | { from: number; what: 2; index: number }
  | { from: number; what: 3 };

type FormValues = ContactFormValues & Partial<InqueryFormValues>;

export default function ContactForm(props: Props): React.ReactElement {
  const t = useT();
  const { lang } = useLang();
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const getSchema = (what: number) => {
    const base = z
      .object({
        name: z.string().min(1, t("form.required")),
        surname: z.string().min(1, t("form.required")),
        email: z.email(t("form.emailErr")),
        phonePrefix: z.string().min(1, t("form.required")),
        phone: z.string().min(1, t("form.required")),
        message: z.string().min(1, t("form.required")),
        gdpr: z.boolean().refine((val) => val === true, {
          message: t("form.required"),
        }),
      })
      .superRefine((data, ctx) => {
        const fullPhone = `${data.phonePrefix}${data.phone}`;

        if (!isValidPhoneNumber(fullPhone)) {
          ctx.addIssue({
            path: ["phone"],
            code: "custom",
            message: t("form.phoneErr"),
          });
        }
      });

    const inquiry = z
      .object({
        priceFrom: z.number().optional(),
        priceTo: z.number().optional(),
        sizeFrom: z.number().optional(),
        sizeTo: z.number().optional(),
        type: z.array(z.number()).optional(),
        bathrooms: z.array(z.number()).optional(),
        bedrooms: z.array(z.number()).optional(),
        arrivalMode: z.enum(["date", "unknown"]),
        arrival: z.date().optional(),
      })
      .superRefine((data, ctx) => {
        if (!data.arrivalMode) {
          ctx.addIssue({
            path: ["arrivalMode"],
            code: "custom",
            message: t("form.checkErr"),
          });
          return;
        }

        if (data.arrivalMode === "date" && !data.arrival) {
          ctx.addIssue({
            path: ["arrival"],
            code: "custom",
            message: t("form.dateErr"),
          });
        }
      });

    if (what === 3) {
      return base.extend(inquiry.shape);
    }

    return base;
  };
  const schema = getSchema(props.what);

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      arrival: null,
      phonePrefix: "+420",
      phone: "",
      priceFrom: 80000,
      priceTo: 2000000,
      sizeFrom: 0,
      sizeTo: 5000,
    },
  });

  const onSubmit = async (data: ContactFormValues): Promise<void> => {
    try {
      setSubmitStatus("idle");
      const payload = {
        ...data,
        fullPhone: `${data.phonePrefix}${data.phone}`,
        from: props.from,
        what: props.what,
        ...(props.what === 2 ? { index: props.index } : {}),
      };
      console.log(payload);
      await createForm(payload);
      setSubmitStatus("success");
      setSubmitMessage(t("form.success"));
      reset();
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 4000);
    } catch {
      setSubmitStatus("error");
      setSubmitMessage(t("form.error"));
    }
  };
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    reset(methods.getValues(), {
      keepValues: true,
      keepDirty: true,
      keepTouched: false,
      keepErrors: false,
    });

    clearErrors();
  }, [lang]);
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${props.what === 1 ? "contact-form" : ""} ${props.what === 3 ? "inquiry-form-wrapper" : ""} ${props.what === 2 ? "det-wrap" : ""}`}
        noValidate
      >
        {props.what === 3 && (
          <div className="init-column">
            <InqueryFormPartRHF />
          </div>
        )}
        <div
          className={props.what === 2 ? "details-form-wrapper" : "base-form"}
        >
          <div className={props.what === 3 ? "long" : "grid-2"}>
            <div className="field">
              <label>{t("form.name")} *</label>
              <input
                {...register("name")}
                className={errors.name ? "input error-input" : "input"}
              />
              {errors.name && (
                <span className="error">{errors.name.message}</span>
              )}
            </div>

            <div className="field">
              <label>{t("form.surname")} *</label>
              <input
                {...register("surname")}
                className={errors.surname ? "input error-input" : "input"}
              />
              {errors.surname && (
                <span className="error">{errors.surname.message}</span>
              )}
            </div>

            <div className="field">
              <label>{t("form.email")} *</label>
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
              <label>{t("form.phone")} *</label>

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

          <div
            className={`field full ${props.what === 3 ? "long" : ""} ${props.what === 2 ? "short" : ""}`}
          >
            <label>{t("form.text")} *</label>
            <textarea
              {...register("message")}
              placeholder={t("form.text_placeholder")}
              className={`input ${errors.message ? " error-input" : ""} ${
                props.what === 3 ? "tall" : ""
              }`}
            />
            {errors.message && (
              <span className="error">{errors.message.message}</span>
            )}
          </div>

          <div className={`gdpr-col ${props.what === 3 ? "long" : ""}`}>
            <label className="gdpr">
              <input type="checkbox" {...register("gdpr")} />
              <span>{t("form.gdpr")} *</span>
            </label>
            {errors.gdpr && (
              <span className="error">{errors.gdpr.message}</span>
            )}
          </div>
          <input
            type="text"
            {...register("website")}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
          <div className={props.what === 3 ? "submit-row long" : "submit-row"}>
            <p className="required-hint">* {t("form.required")}</p>
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
              {isSubmitting ? <span className="spinner" /> : t("form.submit")}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
