"use client"

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { CreateProjectSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import  {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { createProject } from "@/actions/projects/create-project";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const NewProjectForm = ({
  onSuccess
}: {
  onSuccess?: () => void
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  
    useEffect(() => {
      const fetchCustomers = async () => {
        try {
          const response = await fetch("/api/customers");
          if (!response.ok) {
            throw new Error("Failed to fetch customers");
          }
          const data = await response.json();
          setCustomers(data);
        } catch (error) {
          console.error("Error fetching customers:", error);
        }
      };
  
      fetchCustomers();
    }, []);
    
  const form = useForm<z.infer<typeof CreateProjectSchema>>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      deadlineDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      customerId: "",
      priority: "MEDIUM",
    },
  });
 
  const onSubmit = (values: z.infer<typeof CreateProjectSchema>) => {
    startTransition(() => {
          createProject(values)
            .then((data: { error?: string; success?: string }) => {
              if (data?.error) {
                toast({
                  variant: "destructive",
                  title: "Chyba při vytváření projektu",
                  description: data.error,
                });
              };
              if (data?.success) {
                toast({
                  variant: "success",
                  title: data.success,
                });
                form.reset();
                onSuccess?.();
                router.push("/personal/projects");
              }
            })
            .catch(() => {
              toast({
                variant: "destructive",
                title: "Nastala neočekávaná chyba",
                description: "Prosím zkuste to znovu později",
              });
            });
        });
  }

  return (
    <Card>
      <CardHeader>
      <p className="text-lg font-semibold">New Project</p>
      </CardHeader>
      <CardContent>
      <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                  {...field}
                  disabled={isPending}
                  placeholder="Enter project name"
                  />
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Popis</FormLabel>
                <FormControl>
                  <Textarea
                  {...field}
                  disabled={isPending}
                  placeholder="Zadej popis projektu"
                  className="textarea textarea-bordered w-full"
                  />
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers?.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isPending}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value instanceof Date && !isNaN(field.value.getTime()) ? format(field.value, "dd.MM.yyyy") : "Vyber datum"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isPending}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "dd.MM.yyyy") : "Vyber datum"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate = form.getValues("startDate") || new Date();
                            return date < startDate;
                          }}
                          initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadlineDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isPending}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "dd.MM.yyyy") : "Vyber datum"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent> 
                          <SelectItem value="LOW">
                            Low
                          </SelectItem>
                          <SelectItem value="MEDIUM">
                            Medium
                          </SelectItem>
                          <SelectItem value="HIGH">
                            High

                          </SelectItem>
                          <SelectItem value="URGENT">
                            Urgent

                          </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
            </div>
            <Button
              disabled={isPending}
              className="w-full"
              type="submit"
            >
              Vytvořit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default NewProjectForm;