﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace RecipeAPI.Data.Entities;

public partial class MealPlans
{
    public int MealPlanId { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<MealPlanItems> MealPlanItems { get; set; } = new List<MealPlanItems>();

    public virtual Users User { get; set; }
}